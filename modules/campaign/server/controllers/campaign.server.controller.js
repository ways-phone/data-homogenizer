"use strict";

var Repo = require("../repository/campaign.server.repository");
var Handler = require("../../../../services/ResponseHandler");

module.exports = {
  getCampaign: getCampaign,
  getCount: getCount,
  tracker: tracker
};

function getCampaign(req, res) {
  if (req.campaign && req.currentClient) {
    Handler.sendData(res)(Repo.get(req.campaign, req.currentClient));
  } else {
    throw new Error("Campaign and Client should not be empty");
  }
}

function getCount(req, res) {
  if (req.campaign) {
    Repo.count(req.campaign)
      .then(Handler.sendData(res))
      .catch(Handler.sendError(res));
  } else {
    Handler.sendError(res)({ error: "Campaign does not exist" });
  }
}

function tracker(req, res) {
  Repo.getSourceByFileCounts(req.campaign)
    .then(Handler.sendData(res))
    .catch(Handler.sendError(res));
}
