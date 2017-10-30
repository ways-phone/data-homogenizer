"use strict";

var Repo = require("../repository/export.server.repository");
var Handler = require("../../../../services/ResponseHandler");

module.exports = {
  addListToDataset: addList,
  createDataset: create,
  sendDatasets: get,
  pushRecords: push,
  deleteDataset: remove
};

function addList(req, res) {
  Repo.update(req.body.Lists, req.body.Dataset)
    .then(Handler.sendData(res))
    .catch(Handler.sendError(res));
}

function create(req, res) {
  var config = req.body.Config;

  config.campaign = req.campaign;

  Repo.add(config)
    .then(Handler.sendData(res))
    .catch(Handler.sendError(res));
}

function get(req, res) {
  Repo.get(req.campaign)
    .then(Handler.sendData(res))
    .catch(Handler.sendError(res));
}

function push(req, res) {
  Repo.push(req.body.Dataset)
    .then(Handler.sendData(res))
    .catch(Handler.sendError(res));
}

function remove(req, res) {
  Repo.remove(req.query.Dataset)
    .then(Handler.sendData(res))
    .catch(Handler.sendError(res));
}
