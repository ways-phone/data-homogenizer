"use strict";

module.exports = function(app) {
  var client = require("../controllers/campaigns.server.controller");

  var auth = require("../../../../config/auth");

  app.route("/api/client/:acronym").get(auth, client.returnRecordCount);

  app
    .route("/api/client/:acronym/campaigns")
    .post(auth, client.addCampaign)
    .put(auth, client.updateCampaign);

  app.route("/api/all-campaigns").get(auth, client.getAllCampaigns);
};
