"use strict";

module.exports = function(app) {
  var download = require("../controllers/download.server.controller");

  var auth = require("../../../../config/auth");

  app.route("/api/:acronym/:path/download").get(auth, download.get);
};
