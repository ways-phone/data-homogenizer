"use strict";

var mongoose = require("mongoose");
var Record = mongoose.model("Record");
var CsDataset = mongoose.model("CsDataset");
var Promise = require("bluebird");
var Config = require("../../../../config/api");
var XMLParser = Promise.promisifyAll(require("xml2js"));
var request = require("request-promise");

module.exports = (function RecordExporter() {
  return function(dataset) {
    var exclude = [
      "_id",
      "__v",
      "OriginalCost",
      "isDuplicate",
      "isExcluded",
      "isDuplicateWithinFile",
      "isInvalid",
      "isExported",
      "Header",
      "Created",
      "Updated",
      "Extra1",
      "Extra2",
      "Extra3",
      "Extra4"
    ];

    var nested = ["Source", "Client", "Campaign", "List", "File"];

    return {
      push: push,
      getRecordsAsXML: getRecordsAsXML
    };

    function push() {
      return (
        getRecordsAsXML()
          // .then( pushXMLToContactSpace )
          .then(markDatasetAsExported)
          .then(markRecordsAsExported)
      );
    }

    function getRecordsAsXML() {
      return getRecords()
        .then(filterRecordFields)
        .then(convertRecordsToXML);
    }

    function getRecords() {
      return Record.find({ List: { $in: dataset.List }, isExported: false })
        .lean()
        .populate("Client Campaign List File Source");
    }

    function filterRecordFields(records) {
      return Promise.map(records, filterRecord);
    }

    function filterRecord(record) {
      var filtered = {};
      Object.keys(record).forEach(function(key) {
        if (nested.indexOf(key) !== -1) {
          filtered[key] = record[key].DisplayName || record[key].Name;
        } else if (exclude.indexOf(key) === -1) {
          filtered[key] = record[key];
        }
      });

      return filtered;
    }

    function convertRecordsToXML(records) {
      var xmlBuilder = new XMLParser.Builder();

      return Promise.map(records, buildXML);

      function buildXML(record) {
        var xml = xmlBuilder.buildObject(record);

        var lines = xml.split("\n");

        var formatted = lines.splice(1, lines.length).join("\n");

        return formatted
          .replace("<root>", "<record>")
          .replace("</root>", "</record>");
      }
    }

    function pushXMLToContactSpace(xmlRecords) {
      return Promise.map(xmlRecords, pushXmlRecord);

      function pushXmlRecord(xmlRecord) {
        var url =
          "https://apidev.contactspace.com/?apikey=" +
          Config.API_KEY +
          "&function=InsertRecord&module=data&datasetid=" +
          dataset.ID +
          "&xmldata=" +
          xmlRecord;

        return request(url).then(function(resp) {
          console.log("response: ", resp);
        });
      }
    }

    function markDatasetAsExported() {
      return CsDataset.findByIdAndUpdate(
        dataset._id,
        { isExported: true },
        { new: true }
      );
    }

    function markRecordsAsExported() {
      return Record.update(
        { List: { $in: dataset.List } },
        { isExported: true },
        { multi: true }
      );
    }
  };
})();
