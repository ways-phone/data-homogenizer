"use strict";

var mongoose = require("mongoose"),
  Promise = require("bluebird"),
  Source = mongoose.model("Source"),
  Dupes = mongoose.model("DupeRecord"),
  Record = mongoose.model("Record");

module.exports = {
  count: count
};

function count(campaign) {
  return Promise.all([
    returnTotal(campaign),
    returnDuplicates(campaign),
    returnDuplicatesWithinFile(campaign),
    returnInvalids(campaign),
    returnExported(campaign),
    returnCost(campaign)
  ]).spread(function(total, dupes, dupesWithinFile, invalids, exported, cost) {
    return {
      Total: total,
      Dupes: dupes,
      DupesWithinFile: dupesWithinFile,
      Invalids: invalids,
      Exported: exported,
      cost: cost[0].sum
    };
  });
}

function returnTotal(campaign) {
  return Record.count({ Campaign: campaign });
}

function returnDuplicates(campaign) {
  return Dupes.count({ Campaign: campaign, isDuplicate: true });
}

function returnDuplicatesWithinFile(campaign) {
  return Dupes.count({ Campaign: campaign, isDuplicateWithinFile: true });
}

function returnInvalids(campaign) {
  return Record.count({ Campaign: campaign, isInvalid: true });
}

function returnExported(campaign) {
  return Record.count({ Campaign: campaign, isExported: true });
}

function returnCost(campaign) {
  return Record.aggregate([
    { $match: { Campaign: campaign._id } },
    {
      $lookup: {
        from: "sources",
        localField: "Source",
        foreignField: "_id",
        as: "Source"
      }
    },
    { $unwind: "$Source" },
    { $group: { _id: "$Campaign", sum: { $sum: "$Source.Cost" } } }
  ]);
}
