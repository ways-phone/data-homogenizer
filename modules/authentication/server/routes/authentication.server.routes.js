"use strict";

module.exports = function(app) {
  var authenticate = require("../controllers/authentication.server.controller");
  var auth = require("../../../../config/auth");

  app.route("/api/register").post(authenticate.register);

  app.route("/api/login").post(authenticate.login);
};
