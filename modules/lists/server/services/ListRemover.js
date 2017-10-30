"use strict";

var mongoose = require("mongoose");
var List = mongoose.model("List");
var Campaign = mongoose.model("Campaign");
var Record = mongoose.model("Record");
var Promise = require("bluebird");

module.exports = (function() {
  return function(id, campaign) {
    return {
      removeList: removeList
    };

    function removeList() {
      return Promise.all([
        removeListFromCampaign(),
        removeListFromRecords(),
        deleteList()
      ]).spread(formatResponse);
    }

    function deleteList() {
      return List.findByIdAndRemove(id);
    }

    function removeListFromCampaign() {
      return Campaign.findByIdAndUpdate(campaign._id, { $pull: { Lists: id } });
    }

    function removeListFromRecords() {
      console.log("id: ", id);
      return Record.update(
        { List: { $eq: id } },
        { $set: { List: undefined } },
        { multi: true }
      );
    }

    function formatResponse(campaign, recordsModified, deletedList) {
      return recordsModified;
    }
  };
})();
