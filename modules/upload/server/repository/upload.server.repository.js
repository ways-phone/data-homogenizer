"use strict";

var mongoose = require("mongoose");
var Record = mongoose.model("Record");
var File = mongoose.model("File");
var Header = mongoose.model("Header");
var Promise = require("bluebird");
var RecordSaver = require("../services/RecordSaver");

module.exports = {
  save: save
};

function save(config, campaign, client) {
  var recordSaver = RecordSaver(config, campaign, client);

  return recordSaver.save();
}
