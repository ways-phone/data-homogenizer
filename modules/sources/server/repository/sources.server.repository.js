"use strict";

var mongoose = require("mongoose");
var Client = mongoose.model("Client");
var Campaign = mongoose.model("Campaign");
var Source = mongoose.model("Source");
var Record = mongoose.model("Record");
var Promise = require("bluebird");

module.exports = {
  get: get,
  create: create,
  update: update,
  overwrite: overwriteCost
};

function get(campaign) {
  return Source.findOne({ Campaign: campaign._id });
}

function create(config, campaign) {
  var source = new Source(config);

  campaign.Sources.push(source._id);

  return Promise.all([campaign.save(), source.save()]).spread(function(
    campaign,
    source
  ) {
    return {
      source: source,
      campaign: campaign
    };
  });
}

function update(source) {
  return Source.findByIdAndUpdate(source._id, source, { new: true });
}

function overwriteCost(config, campaign) {
  var start = new Date(config.Start);
  start.setHours(0, 0, 0);

  var end = new Date(config.End);
  end.setHours(23, 59, 59);

  var update = {
    Campaign: campaign._id,
    Source: config.Source._id,
    Created: {
      $gte: start,
      $lt: end
    }
  };

  return Record.update(
    update,
    { OriginalCost: config.Source.Cost },
    { multi: true }
  );
}
