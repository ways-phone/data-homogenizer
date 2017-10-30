"use strict";

var Promise = require("bluebird");
var mongoose = require("mongoose");
var Record = mongoose.model("Record");
var File = mongoose.model("File");

module.exports = (function FileInfoRetriever() {
  var campaign;

  return {
    all: allFiles
  };

  function allFiles(currentCampaign) {
    campaign = currentCampaign;

    return Promise.all([campaignFiles(), filesThatHaveLists()]).spread(function(
      all,
      listFiles
    ) {
      return {
        all: all,
        listFiles: listFiles.map(function(file) {
          return file._id;
        })
      };
    });
  }

  function campaignFiles() {
    return Record.find({ Campaign: campaign._id })
      .distinct("File")
      .then(function(files) {
        return File.find({ _id: { $in: files } });
      });
  }

  function filesThatHaveLists() {
    return Record.aggregate([
      { $match: { List: { $ne: undefined } } },
      {
        $lookup: {
          from: "files",
          localField: "File",
          foreignField: "_id",
          as: "File"
        }
      },
      { $unwind: "$File" },
      { $group: { _id: "$File" } }
    ]);
  }
})();
