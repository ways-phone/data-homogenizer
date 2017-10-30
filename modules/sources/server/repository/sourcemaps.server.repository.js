"use strict";

var mongoose = require("mongoose");
var Sourcemap = mongoose.model("SourceMap");

module.exports = {
  get: get,
  remove: remove
};

function get(campaign) {
  return Sourcemap.find({ Campaign: campaign._id }).populate("Source");
}

function remove(map) {
  return Sourcemap.findByIdAndRemove(map);
}
