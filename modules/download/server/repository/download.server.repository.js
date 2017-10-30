"use strict";

var mongoose = require("mongoose");
var Promise = require("bluebird");
var Dupes = mongoose.model("DupeRecord");
var Record = mongoose.model("Record");
var Service = require("../services/index");

module.exports = {
  get: get
};

function get(query) {
  var config = Service.queryParser.parse(query);

  return Promise.all([findRecords(), findDupes()]).spread(function(
    records,
    dupes
  ) {
    return Service.recordFormatter.format(records.concat(dupes));
  });

  /////////////////////

  function findRecords() {
    return Record.find(config.query)
      .lean()
      .populate("Source Client Campaign File List");
  }

  function findDupes() {
    return Dupes.find(config.dupeQuery)
      .lean()
      .populate("Source Client Campaign File List");
  }
}
