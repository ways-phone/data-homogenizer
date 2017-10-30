"use strict";

module.exports = function(app) {
  var lists = require("../controllers/lists.server.controller");
  var params = require("../../../../services/ExpressParams");
  var auth = require("../../../../config/auth");
  app
    .route("/api/:acronym/:path/lists")
    .get(auth, lists.counts)
    .post(auth, lists.create)
    .delete(auth, lists.remove);

  app.route("/api/:acronym/:path/view-lists").get(auth, lists.get);

  // app.param('path', params.campaignByPath);
  // app.param('acronym', params.clientByAcronym);
};
