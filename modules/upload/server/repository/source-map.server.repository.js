"use strict";

var mongoose = require("mongoose");
var SourceMap = mongoose.model("SourceMap");
var Promise = require("bluebird");

module.exports = {
  get: get,
  save: save
};

function get(campaign) {
  return SourceMap.find({
    Campaign: campaign._id
  }).populate("Source");
}

function save(mappings) {
  return Promise.map(mappings, saveMap);
  ///////////////////

  function saveMap(map) {
    var sourceMap = new SourceMap(map);

    return sourceMap.save();
  }
}
