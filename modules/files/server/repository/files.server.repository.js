"use strict";

var Service = require("../services/services");

module.exports = {
  get: get,
  remove: remove
};

function get(campaign) {
  return Service.FileRetriever.all(campaign).then(function(fileInfo) {
    return Service.FilePopulater.populate(fileInfo);
  });
}

function remove(query, campaign) {
  return Service.FileRemover(query, campaign).remove();
}
