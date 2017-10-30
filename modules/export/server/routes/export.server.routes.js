"use strict";

module.exports = function(app) {
  var exportCtrl = require("../controllers/export.server.controller");

  var auth = require("../../../../config/auth");

  app
    .route("/api/:acronym/:path/export")
    .get(auth, exportCtrl.sendDatasets)
    .post(auth, exportCtrl.createDataset)
    .patch(auth, exportCtrl.pushRecords)
    .delete(auth, exportCtrl.deleteDataset)
    .put(auth, exportCtrl.addListToDataset);
};
