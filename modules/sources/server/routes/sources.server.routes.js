"use strict";

module.exports = function(app) {
  var sources = require("../controllers/sources.server.controller");
  var auth = require("../../../../config/auth");

  app
    .route("/api/:acronym/:path/sources")
    .get(auth, sources.get)
    .post(auth, sources.create)
    .put(auth, sources.update);

  app.route("/api/:acronym/:path/sources/cost").post(auth, sources.overwrite);
};
