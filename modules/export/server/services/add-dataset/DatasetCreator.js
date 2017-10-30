"use strict";

var Promise = require("bluebird");
var mongoose = require("mongoose");
var List = mongoose.model("List");
var CsDataset = mongoose.model("CsDataset");

module.exports = (function DatasetCreator() {
  return function(config) {
    return {
      create: createDataset
    };

    function createDataset(resp) {
      return Promise.all([
        addDataset(resp),
        markListsExported()
      ]).spread(function(dataset, lists) {
        return {
          dataset: dataset,
          lists: lists
        };
      });
    }

    function addDataset(resp) {
      // var id = resp.xml.datasets[0].dataset[0].id[0];
      var id = Math.floor(Math.random() * 100);
      var dataset = new CsDataset({
        Name: config.name,
        ID: id,
        Campaign: config.campaign._id,
        List: config.lists
      });
      return dataset.save();
    }

    function markListsExported() {
      return Promise.map(config.lists, markListExported);
    }

    function markListExported(list) {
      return List.findByIdAndUpdate(
        list._id,
        { isExported: true },
        { new: true }
      );
    }
  };
})();
