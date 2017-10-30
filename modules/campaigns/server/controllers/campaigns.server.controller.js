"use strict";

var Handler = require("../../../../services/ResponseHandler");
var Repo = require("../repository/campaigns.server.repository");

module.exports = {
  returnRecordCount: returnRecordCount,
  addCampaign: addCampaign,
  updateCampaign: updateCampaign,
  getAllCampaigns: getAllCampaigns
};

function returnRecordCount(req, res) {
  if (req.currentClient) {
    Repo.recordCount(req.currentClient)
      .then(Handler.sendData(res))
      .catch(Handler.sendError(res));
  } else {
    Handler.sendError(res)("Client no longer exists");
  }
}

function getAllCampaigns(req, res) {
  Repo.get()
    .then(Handler.sendData(res))
    .catch(Handler.sendError(res));
}

function addCampaign(req, res) {
  // set the client on the campaign to add
  req.body.Campaign.Client = req.currentClient._id;

  Repo.add(req.body.Campaign)
    .then(Handler.sendData(res))
    .catch(Handler.sendError(res));
}

function updateCampaign(req, res) {
  var update = req.body.Campaign;

  update.Client = req.currentClient._id;
  update.Updated = new Date();

  Repo.update(update)
    .then(Handler.sendData(res))
    .catch(Handler.sendError(res));
}
