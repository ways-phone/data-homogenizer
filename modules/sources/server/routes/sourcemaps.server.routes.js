"use strict";

module.exports = function(app) {
  var sourcemaps = require("../controllers/sourcemaps.server.controller");
  var auth = require("../../../../config/auth");

  app
    .route("/api/:acronym/:path/sourcemaps")
    .get(auth, sourcemaps.get)
    .delete(auth, sourcemaps.remove);
};
