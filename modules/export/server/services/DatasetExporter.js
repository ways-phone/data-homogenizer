"use strict";

module.exports = (function DatasetExporter() {
  var config;

  return { push: push };

  function push(context) {
    config = context;
    var csRequest = require("./add-dataset/ContactSpaceRequest");
    var datasetCreator = require("./add-dataset/DatasetCreator")(config);
    //return csRequest.make( config ).then( datasetCreator.create );
    return datasetCreator.create();
  }
})();
