"use strict";

var mongoose = require("mongoose");
var Record = mongoose.model("Record");
var SearchService = require("../services/SearchRecords");

module.exports = {
  get: get,
  update: update
};

function get(query) {
  return SearchService(query).search();
}

function update(config) {
  return Record.findByIdAndUpdate(config.id, config.update, {
    new: true
  }).populate("Client Campaign File List Source Header");
}
