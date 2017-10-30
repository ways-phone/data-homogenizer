"use strict";

var Repo = require("../repository/headers.server.repository");
var Handler = require("../../../../services/ResponseHandler");

module.exports = {
  check: check,
  save: save,
  sendUniversalHeaders: sendUniversalHeaders
};

function check(req, res) {
  Repo.check(req.campaign, req.query.Header)
    .then(Handler.sendData(res))
    .catch(Handler.sendError(res));
}

function save(req, res) {
  Repo.save(req.body.map, req.campaign, req.currentClient)
    .then(Handler.sendData(res))
    .catch(Handler.sendError(res));
}

function sendUniversalHeaders(req, res) {
  Handler.sendData(res)([
    "CustKey",
    "HomePhone",
    "MobilePhone",
    "DOB",
    "Gender",
    "Title",
    "FirstName",
    "LastName",
    "Address1",
    "Address2",
    "Timestamp",
    "Suburb",
    "State",
    "Postcode",
    "Email",
    "Source",
    "SiteLabel",
    "Extra1",
    "Extra2",
    "Extra3",
    "Extra4"
  ]);
}
