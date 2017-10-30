"use strict";

var Repo = require("../repository/core.server.repository");
var Handler = require("../../../../services/ResponseHandler");

module.exports = {
  renderIndex: renderIndex,
  returnClients: returnClients,
  addClient: addClient,
  removeClient: removeClient,
  updateClient: updateClient
};

function renderIndex(req, res) {
  res.render("index");
}

// returns all clients stored in the db
function returnClients(req, res) {
  Repo.get()
    .then(Handler.sendData(res))
    .catch(Handler.sendError(res));
}

// adds a client and saves it to the db
function addClient(req, res) {
  Repo.add(req.body)
    .then(Handler.sendData(res))
    .catch(Handler.sendError(res));
}

// removes a client by a passed in id
function removeClient(req, res) {
  Repo.remove(req.query)
    .then(Handler.sendData(res))
    .catch(Handler.sendError(res));
}

// updates a client and sets the updated property to now
function updateClient(req, res) {
  Repo.update(req.body)
    .then(Handler.sendData(res))
    .catch(Handler.sendError(res));
}
