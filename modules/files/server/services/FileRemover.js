"use strict";

var Promise = require("bluebird");
var mongoose = require("mongoose");
var Record = mongoose.model("Record");
var Dupes = mongoose.model("DupeRecord");
var File = mongoose.model("File");
var Campaign = mongoose.model("Campaign");

module.exports = (function FileRemover() {
  return function(query, campaign) {
    return {
      remove: remove
    };

    function remove() {
      return Promise.all([
        removeRecords(),
        removeDupes(),
        removeFileFromCampaign(),
        removeFile()
      ]).spread(formatResponse);
    }

    function removeRecords() {
      return Record.remove(query);
    }

    function removeDupes() {
      return Dupes.remove(query);
    }

    function removeFileFromCampaign() {
      return Campaign.findByIdAndUpdate(
        campaign._id,
        { $pull: { Files: query.File } },
        { new: true }
      ).populate("Files Sources");
    }

    function removeFile() {
      return File.findByIdAndRemove(query.File);
    }

    function formatResponse(
      recordsRemoved,
      dupesRemoved,
      campaign,
      fileRemoved
    ) {
      return campaign;
    }
  };
})();
