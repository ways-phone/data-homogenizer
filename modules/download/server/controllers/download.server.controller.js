"use strict";

var Handler = require("../../../../services/ResponseHandler");
var Repo = require("../repository/download.server.repository");

module.exports = {
  get: get
};

function get(req, res) {
  Repo.get(req.query)
    .then(Handler.sendData(res))
    .catch(Handler.sendError(res));
}
