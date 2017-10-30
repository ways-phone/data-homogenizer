"use strict";

var mongoose = require("mongoose"),
  Promise = require("bluebird"),
  _ = require("underscore"),
  Record = mongoose.model("Record");

module.exports = (function ListRetriever() {
  return function(config) {
    return {
      retrieve: retrieve
    };

    function retrieve() {
      return getRecords().then(uniqueSourcesAndFiles);
    }

    function getRecords() {
      return Record.find(config.search).populate("Source File");
    }

    function uniqueSourcesAndFiles(records) {
      return Promise.all([
        uniqueSources(records),
        uniqueFiles(records)
      ]).spread(function(sources, files) {
        return {
          sources: sources,
          files: files,
          records: records
        };
      });
    }

    function uniqueSources(records) {
      return _.uniq(
        _.map(_.flatten(records), function(record) {
          return record.Source;
        })
      );
    }

    function uniqueFiles(records) {
      return _.uniq(
        _.map(_.flatten(records), function(record) {
          return record.File;
        })
      );
    }
  };
})();
