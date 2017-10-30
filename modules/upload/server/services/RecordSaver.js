"use strict";

var mongoose = require("mongoose");
var Record = mongoose.model("Record");
var File = mongoose.model("File");
var Header = mongoose.model("Header");
var Promise = require("bluebird");

module.exports = (function() {
  return function(config, campaign, client) {
    var response = {
      dupesWithinFile: 0,
      dupes: 0
    };

    var file = new File({
      Name: config.filename,
      Campaign: campaign,
      Header: config.header
    });

    var baseRecord = {
      File: file._id,
      Campaign: campaign._id,
      Client: client._id,
      Header: config.header
    };

    return {
      save: save
    };

    function save() {
      return Promise.all([
        createFile(),
        addFileAndSaveCampaign(),
        saveRecords()
      ]).spread(formatResponse);
    }

    function createFile() {
      return file.save();
    }

    function addFileAndSaveCampaign() {
      campaign.Files.push(file._id);
      return campaign.save();
    }

    function saveRecords() {
      return Promise.map(config.records, function(record) {
        var toSave = new Record(Object.assign(baseRecord, record));

        return toSave.save().catch(getCounts);
      });
    }

    function getCounts(error) {
      if (error.errmsg.match(/.*_File_1/g)) {
        response.dupesWithinFile++;
      } else if (error.errmsg.match(/.*_Campaign_1/g)) {
        {
          response.dupes++;
        }
      } else {
        throw Error(error.errmsg);
      }
    }

    function formatResponse(file, campaign, records) {
      response.count = records.length;
      return {
        response: response,
        campaign: campaign
      };
    }
  };
})();
