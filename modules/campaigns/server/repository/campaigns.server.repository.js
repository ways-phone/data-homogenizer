"use strict";

var mongoose = require("mongoose");
var Client = mongoose.model("Client");
var Record = mongoose.model("Record");
var Campaign = mongoose.model("Campaign");

module.exports = {
  recordCount: recordCount,
  get: get,
  add: add,
  update: update
};

function recordCount(client) {
  return Record.count({ Client: client }).then(function(count) {
    return {
      client: client,
      count: count
    };
  });
}

function get() {
  return Campaign.find({}).populate("Client");
}

function add(toAdd) {
  var campaign = new Campaign(toAdd);

  return campaign
    .save()
    .then(populateUser)
    .then(updateClient)
    .catch(rollback);

  ///////////////////////

  function populateUser(saved) {
    return saved.populate("Creator", "FullName");
  }

  function updateClient(campaign) {
    var update = {
      $push: {
        Campaigns: campaign._id
      }
    };

    return Client.findByIdAndUpdate(campaign.Client, update, {
      new: true
    }).deepPopulate(
      "Campaigns Campaigns.Sources Campaigns.Files Campaigns.Lists Campaigns.Creator"
    );
  }

  function rollback(error) {
    return Campaign.findByIdAndRemove(campaign._id).then(
      removeCampaignFromClient
    );

    ///////////////////////////

    function removeCampaignFromClient() {
      return Client.findByIdAndUpdate(campaign.Client, {
        $pull: { Campaigns: campaign._id }
      });
    }
  }
}

function update(update) {
  return Campaign.findOne({ _id: update._id })
    .then(copyKeysForUpdate)
    .then(returnUpdatedClient);

  ////////////////////////////////

  function copyKeysForUpdate(campaign) {
    var exclude = ["Created"];

    Object.keys(campaign._doc).forEach(copyRightKeys);

    return campaign.save();

    ///////////////////////

    function copyRightKeys(key) {
      if (!update[key]) return;
      if (exclude.indexOf(key) === -1) campaign[key] = update[key];
    }
  }

  function returnUpdatedClient() {
    return Client.findOne({ _id: update.Client }).deepPopulate(
      "Creator.FullName Campaigns Campaigns.Sources Campaigns.Files Campaigns.Lists Campaigns.Creator"
    );
  }
}
