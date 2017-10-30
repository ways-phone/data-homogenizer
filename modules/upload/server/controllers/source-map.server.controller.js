"use strict";

var Repo = require("../repository/source-map.server.repository");
var Handler = require("../../../../services/ResponseHandler");

module.exports = {
  save: save,
  get: get
};

function save(req, res) {
  Repo.save(req.body.map)
    .then(Handler.sendData(res))
    .catch(Handler.sendError(res));
}

function get(req, res) {
  Repo.get(req.campaign)
    .then(Handler.sendData(res))
    .catch(Handler.sendError(res));
}
