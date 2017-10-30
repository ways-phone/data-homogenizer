"use strict";

var mongoose = require("mongoose");
var List = mongoose.model("List");

var Services = require("../services/services");

module.exports = {
  counts: counts,
  create: create,
  get: get,
  remove: remove
};

function counts(query, campaign) {
  return Services.Aggregator.create(query, campaign._id);
}

function create(config) {
  return Services.Creator(config).create();
}

function get(campaign) {
  return List.find({ Campaign: campaign._id }).populate("Sources Files");
}

function remove(id, campaign) {
  var remover = Services.Remover(id, campaign);

  return remover.removeList();
}
