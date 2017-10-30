"use strict";

var Repo = require("../repository/files.server.repository");
var Handler = require("../../../../services/ResponseHandler");

module.exports = {
  get: get,
  remove: remove
};

function get(req, res) {
  Repo.get(req.campaign)
    .then(Handler.sendData(res))
    .catch(Handler.sendError(res));
}

function remove(req, res) {
  Repo.remove(req.query, req.campaign)
    .then(Handler.sendData(res))
    .catch(Handler.sendError(res));
}
