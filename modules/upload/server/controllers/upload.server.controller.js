"use strict";

var Repo = require("../repository/upload.server.repository");
var Handler = require("../../../../services/ResponseHandler");

module.exports = {
  save: save
};

function save(req, res) {
  Repo.save(req.body, req.campaign, req.currentClient)
    .then(Handler.sendData(res))
    .catch(Handler.sendError(res));
}
