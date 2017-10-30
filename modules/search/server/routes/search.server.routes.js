"use strict";

module.exports = function(app) {
  var search = require("../controllers/search.server.controller");
  var auth = require("../../../../config/auth");

  app
    .route("/api/search")
    .get(auth, search.searchRecord)
    .post(auth, search.updateRecord);
};
