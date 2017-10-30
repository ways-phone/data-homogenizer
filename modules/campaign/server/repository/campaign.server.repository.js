"use strict";

var mongoose = require("mongoose");
var CountService = require("../services/campaign-count.server.controller.service");
var Tracker = require("../services/tracker.server.service");

module.exports = {
  get: get,
  count: count,
  getSourceByFileCounts: getSourceByFileCounts
};

function get(campaign, client) {
  return {
    campaign: campaign.populate("Files"),
    client: client
  };
}

function count(campaign) {
  return CountService.count(campaign);
}

function getSourceByFileCounts(campaign) {
  var tracker = Tracker(campaign);
  return tracker.get();
}
