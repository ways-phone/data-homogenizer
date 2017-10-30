"use strict";

var mongoose = require("mongoose");
var Client = mongoose.model("Client");
var Record = mongoose.model("Record");

module.exports = {
  get: get,
  add: add,
  remove: remove,
  update: update
};

function get() {
  return Client.find({})
    .deepPopulate(
      "Campaigns Campaigns.Sources Campaigns.Files Campaigns.Lists Creator.FullName"
    )
    .sort("Name");
}

function add(body) {
  var client = new Client(body);

  return client.save().then(findAndPopulateSavedClient);

  ////////////////////////////////////

  function findAndPopulateSavedClient(saved) {
    return Client.findOne({ _id: saved._id }).populate("Creator", "FullName");
  }
}

function remove(id) {
  return Client.findByIdAndRemove(id);
}

function update(toUpdate) {
  return Client.findOne({ _id: toUpdate._id }).then(updateClient);

  ////////////////////////////////////////

  function updateClient(client) {
    toUpdate.Updated = new Date();

    Object.keys(toUpdate).forEach(updateOffKeys);

    return save();

    ///////////////////////////////////

    function updateOffKeys(key) {
      if (client[key]) {
        client[key] = toUpdate[key];
      }
    }

    function save() {
      return client
        .save()
        .then(function() {
          return Client.findOne({ _id: client._id }).populate(
            "Creator",
            "FullName"
          );
        })
        .catch(function(error) {
          return error;
        });
    }
  }
}
