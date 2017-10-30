"use strict";

var mongoose = require("mongoose");
var Promise = require("bluebird");
var Record = mongoose.model("Record");

module.exports = (function() {
  return {
    create: createAggregate
  };

  function createAggregate(query, campaign_id) {
    query = JSON.parse(query);

    return Record.aggregate(createAggregateArray(query, campaign_id));

    ////////////////////
    function createAggregateArray(query, campaign_id) {
      if (query.lookup1 && !query.lookup2) {
        return [
          {
            $match: {
              Campaign: campaign_id,
              isDuplicate: false,
              isDuplicateWithinFile: false,
              isExcluded: false,
              isInvalid: false,
              List: undefined
            }
          },
          { $group: { _id: query.$group, count: { $sum: 1 } } },
          { $lookup: query.lookup1 },
          { $unwind: query.unwind1 }
        ];
      } else if (!query.lookup1 && query.lookup2) {
        return [
          {
            $match: {
              Campaign: campaign_id,
              isDuplicate: false,
              isDuplicateWithinFile: false,
              isExcluded: false,
              isInvalid: false,
              List: undefined
            }
          },
          { $group: { _id: query.$group, count: { $sum: 1 } } },
          { $lookup: query.lookup2 },
          { $unwind: query.unwind2 }
        ];
      } else if (query.lookup1 && query.lookup2) {
        return [
          {
            $match: {
              Campaign: campaign_id,
              isDuplicate: false,
              isDuplicateWithinFile: false,
              isExcluded: false,
              isInvalid: false,
              List: undefined
            }
          },
          { $group: { _id: query.$group, count: { $sum: 1 } } },
          { $lookup: query.lookup1 },
          { $unwind: query.unwind1 },
          { $lookup: query.lookup2 },
          { $unwind: query.unwind2 }
        ];
      } else {
        return [
          {
            $match: {
              Campaign: campaign_id,
              isDuplicate: false,
              isDuplicateWithinFile: false,
              isExcluded: false,
              isInvalid: false,
              List: undefined
            }
          },
          { $group: { _id: query.$group, count: { $sum: 1 } } }
        ];
      }
    }
  }
})();
