"use strict";

var mongoose = require("mongoose");
var List = mongoose.model("List");
var CsDataset = mongoose.model("CsDataset");
var Promise = require("bluebird");
var exporters = require("../services/exporters");

module.exports = {
  update: addList,
  add: createContactSpaceDataset,
  get: getDatasets,
  push: pushRecordsToContactSpace,
  remove: removeDataset
};

function addList(lists, dataset) {
  return Promise.all([updateDataset(), markListsExported()]).spread(function(
    updated,
    exported
  ) {
    return updated;
  });

  //////////////////////

  function updateDataset() {
    var update = {
      $push: { List: { $each: lists } },
      isExported: false
    };

    return CsDataset.findByIdAndUpdate(dataset._id, update, { new: true });
  }

  function markListsExported() {
    return Promise.map(lists, function(list) {
      return List.findByIdAndUpdate(list._id, { isExported: true });
    });
  }
}

function createContactSpaceDataset(config) {
  return exporters.dataset.push(config);
}

function getDatasets(campaign) {
  return CsDataset.find({ Campaign: campaign._id }).populate("List");
}

function pushRecordsToContactSpace(dataset) {
  return exporters.record.push(dataset);
}

function removeDataset(id) {
  return CsDataset.findById(id)
    .then(markListsAsNotExported)
    .then(deleteDataset);

  /////////////////////////

  function markListsAsNotExported(dataset) {
    return Promise.map(dataset.List, function(list) {
      return List.findByIdAndUpdate(list, { isExported: false });
    });
  }

  function deleteDataset() {
    return CsDataset.findByIdAndRemove(id).populate("List");
  }
}
