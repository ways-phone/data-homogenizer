"use strict";

var mongoose = require("mongoose");
var Header = mongoose.model("Header");
var File = mongoose.model("File");
var Campaign = mongoose.model("Campaign");

module.exports = {
  get: get,
  getFiles: getFiles,
  remove: remove
};

function get(campaign) {
  return Header.find({ Campaign: campaign });
}

function getFiles(header_id) {
  return File.find({ Header: header_id });
}

function remove(header_id) {
  return Header.findByIdAndRemove(header_id);
}
