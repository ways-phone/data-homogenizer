"use strict";

var Repo = require("../repository/header.server.repository");
var Handler = require("../../../../services/ResponseHandler");

module.exports = {
  get: get,
  getFiles: getFiles,
  remove: remove
};

function get(req, res) {
  Repo.get(req.campaign)
    .then(Handler.sendData(res))
    .catch(Handler.sendError(res));
}

function getFiles(req, res) {
  Repo.getFiles(req.header_id)
    .then(Handler.sendData(res))
    .catch(Handler.sendError(res));
}

function remove(req, res) {
  Repo.remove(req.header._id)
    .then(Handler.sendData(res))
    .catch(Handler.sendError(res));
}
