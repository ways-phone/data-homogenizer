"use strict";

module.exports = function(app) {
  var search = require("../controllers/search-records.server.controller");
  var params = require("../../../../services/ExpressParams");
  var auth = require("../../../../config/auth");
  app
    .route("/api/search-records/")
    .get(auth, search.get)
    .post(auth, search.update);
};
