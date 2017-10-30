"use strict";

var Promise = require("bluebird");
var mongoose = require("mongoose");
var Record = mongoose.model("Record");
var Dupes = mongoose.model("DupeRecord");
var List = mongoose.model("List");
var Source = mongoose.model("Source");

module.exports = (function FilePopulater() {
  return {
    populate: populate
  };

  function populate(fileInfo) {
    return Promise.map(fileInfo.all, details).then(function(files) {
      fileInfo.all = files;

      return fileInfo;
    });
  }

  function details(file) {
    return Promise.all([
      getRecordCount(file),
      getDupeCount(file),
      getUniqeSources(file),
      getUniqueLists(file)
    ]).spread(function(recordCount, dupeCount, sources, lists) {
      var response = {
        total: recordCount + dupeCount,
        dupeCount: dupeCount,
        sources: sources,
        lists: lists
      };

      return Object.assign(response, file.toJSON());
    });
  }

  function getRecordCount(file) {
    return Record.count({ File: file });
  }

  function getDupeCount(file) {
    return Dupes.count({ File: file });
  }

  function getUniqeSources(file) {
    return Record.find({ File: file })
      .distinct("Source")
      .then(function(sources) {
        return Source.find({ _id: { $in: sources } });
      });
  }

  function getUniqueLists(file) {
    return Record.find({ File: file })
      .distinct("List")
      .then(function(lists) {
        return List.find({ _id: { $in: lists } });
      });
  }
})();
