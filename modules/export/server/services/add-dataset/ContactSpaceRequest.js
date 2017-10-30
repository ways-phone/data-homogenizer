"use strict";
var API = require("../../../../../config/api");
var Promise = require("bluebird");
var XMLParser = Promise.promisifyAll(require("xml2js"));
var request = require("request-promise");

module.exports = (function ContactSpaceRequest() {
  var config;

  return {
    make: make
  };

  function make(context) {
    config = context;

    return createDatasetInContactSpace().then(receiveRequestResponse);
  }

  function createDatasetInContactSpace() {
    var url =
      "https://apidev.contactspace.com/?apikey=" +
      API.API_KEY +
      "&function=CreateDataSet&initiativeid=" +
      config.campaign.ContactSpaceID +
      "&datasetname=" +
      config.name +
      "&active=0";

    return request(url);
  }

  function receiveRequestResponse(body) {
    return XMLParser.parseStringAsync(body);
  }
})();
