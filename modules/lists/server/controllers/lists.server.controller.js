"use strict";

var Repo = require("../repository/lists.server.repository");
var Handler = require("../../../../services/ResponseHandler");

module.exports = {
  counts: counts,
  create: create,
  get: get,
  remove: remove
};

function counts(req, res) {
  Repo.counts(req.query.data, req.campaign)
    .then(Handler.sendData(res))
    .catch(Handler.sendError(res));
}

function create(req, res) {
  req.body.campaign = req.campaign;
  req.body.client = req.currentClient;

  Repo.create(req.body)
    .then(Handler.sendData(res))
    .catch(Handler.sendError(res));
}

function get(req, res) {
  Repo.get(req.campaign)
    .then(Handler.sendData(res))
    .catch(Handler.sendError(res));
}

function remove(req, res) {
  Repo.remove(req.query.data, req.campaign)
    .then(Handler.sendData(res))
    .catch(Handler.sendError(res));
}
