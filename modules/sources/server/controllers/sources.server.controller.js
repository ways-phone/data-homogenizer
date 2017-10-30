"use strict";

var Repo = require("../repository/sources.server.repository");
var Handler = require("../../../../services/ResponseHandler");

module.exports = {
  get: get,
  create: create,
  update: update,
  overwrite: overwrite
};

function get(req, res) {
  Repo.get(req.campaign)
    .then(Handler.sendData(res))
    .catch(Handler.sendError(res));
}

function create(req, res) {
  Repo.create(req.body, req.campaign)
    .then(Handler.sendData(res))
    .catch(Handler.sendError(res));
}

function update(req, res) {
  req.body.Source.Updated = new Date();

  Repo.update(req.body.Source)
    .then(Handler.sendData(res))
    .catch(Handler.sendError(res));
}

function overwrite(req, res) {
  Repo.overwrite(req.body, req.campaign)
    .then(Handler.sendData(res))
    .catch(Handler.sendError(res));
}
