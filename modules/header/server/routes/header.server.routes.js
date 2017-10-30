"use strict";

module.exports = function(app) {
  var header = require("../controllers/header.server.controller");
  var params = require("../../../../services/ExpressParams");
  var auth = require("../../../../config/auth");

  app.route("/api/:acronym/:path/edit-header").get(auth, header.get);

  app
    .route("/api/:acronym/:path/edit-header/:header_id")
    .get(auth, header.getFiles)
    .delete(auth, header.remove);
};
