"use strict";

module.exports = function(app) {
  var upload = require("../controllers/upload.server.controller");
  var headers = require("../controllers/headers.server.controller");
  var sourceMap = require("../controllers/source-map.server.controller");
  var params = require("../../../../services/ExpressParams");
  var auth = require("../../../../config/auth");

  app
    .route("/api/:acronym/:path/headers")
    .get(auth, headers.sendUniversalHeaders)
    .post(auth, headers.check)
    .put(auth, headers.save);

  app.route("/api/:acronym/:path/records").post(auth, upload.save);

  app
    .route("/api/:acronym/:path/source-map")
    .get(auth, sourceMap.get)
    .post(auth, sourceMap.save);

  // app.param('path', params.campaignByPath);
  // app.param('acronym', params.clientByAcronym);
};
