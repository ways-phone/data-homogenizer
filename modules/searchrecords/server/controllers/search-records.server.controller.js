"use strict";

var Repo = require("../repository/search-records.server.repository");
var Handler = require("../../../../services/ResponseHandler");

module.exports = {
  get: get,
  update: update
};

function get(req, res) {
  Repo.get(req.query)
    .then(Handler.sendData(res))
    .catch(Handler.sendError(req));
}

function update(req, res) {
  Repo.update(req.body)
    .then(Handler.sendData(res))
    .catch(Handler.sendError(req));
}
