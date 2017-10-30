"use strict";

module.exports = function(app) {
  var core = require("../controllers/core.server.controller");

  var auth = require("../../../../config/auth");

  app.route("/").get(core.renderIndex);

  app
    .route("/api/clients")
    .get(auth, core.returnClients)
    .post(auth, core.addClient)
    .delete(auth, core.removeClient)
    .put(auth, core.updateClient);
};
