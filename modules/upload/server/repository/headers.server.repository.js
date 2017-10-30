"use strict";

var HeaderService = require("../services/Header/services");

module.exports = {
  check: check,
  save: save
};

function check(campaign, newHeader) {
  var flattener = HeaderService.flattener(campaign);
  var comparer = HeaderService.comparer(newHeader);

  return flattener.flatten().then(comparer.findMatch);
}

function save(headerToSave, campaign, client) {
  headerToSave.Client = client._id;
  headerToSave.Campaign = campaign._id;

  var saver = HeaderService.saver();

  return saver.save(headerToSave);
}
