"use strict";

module.exports = function(app) {
  var campaign = require("../controllers/campaign.server.controller");
  var params = require("../../../../services/ExpressParams");
  var auth = require("../../../../config/auth");

  app.route("/api/:acronym/:path").get(auth, campaign.getCampaign);

  app.route("/api/:acronym/:path/count").get(auth, campaign.getCount);

  app.route("/api/:acronym/:path/tracker").get(auth, campaign.tracker);

  app.param("acronym", params.clientByAcronym);
  app.param("path", params.campaignByPath);
  app.param("header_id", params.headerById);
};
