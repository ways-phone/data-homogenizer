"use strict";

module.exports = function(app) {
  var files = require("../controllers/files.server.controller");

  var auth = require("../../../../config/auth");

  app
    .route("/api/:acronym/:path/files")
    .get(auth, files.get)
    .delete(auth, files.remove);
};
