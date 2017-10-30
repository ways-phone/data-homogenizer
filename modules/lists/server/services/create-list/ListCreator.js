"use strict";

var mongoose = require("mongoose");
var List = mongoose.model("List");
var Promise = require("bluebird");

var NameCreator = require("./ListNameCreator");
var DataRetriever = require("./ListDataRetriever");

module.exports = (function() {
  return function(config) {
    return {
      create: create
    };

    function create() {
      var nameCreator = NameCreator(config);

      var retriever = DataRetriever(config);

      setQuery(config.search);

      var name = nameCreator.create();

      return retriever.retrieve().then(createList);

      ////////////////////////////////////////////

      function createList(results) {
        return createNewList(name, results.files, results.sources)
          .then(addListToCampaignAndRecords(results.records))
          .then(formatResponse);
      }

      function formatResponse(records) {
        return {
          listName: name,
          campaign: config.campaign,
          count: records.length
        };
      }
    }

    function setQuery(search) {
      search.Campaign = config.campaign._id;
      search.List = undefined;
      search.isInvalid = false;
      search.isExcluded = false;
      search.isExported = false;
    }

    function createNewList(listName, files, sources) {
      var list = new List({
        Name: listName,
        Campaign: config.campaign._id,
        Count: config.count,
        Files: files,
        Sources: sources
      });
      return list.save();
    }

    function addListToCampaignAndRecords(records) {
      return function(list) {
        return Promise.all([
          addListToCampaign(list),
          addListToRecords(records, list)
        ]).spread(function(list, records) {
          return records;
        });
      };
    }

    function addListToCampaign(list) {
      config.campaign.Lists.push(list);

      return config.campaign.save();
    }

    function addListToRecords(records, list) {
      return Promise.map(records, function(record) {
        record.List = list;
        return record.save();
      });
    }
  };
})();
