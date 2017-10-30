"use strict";

var Promise = require("bluebird");
var _ = require("underscore");

module.exports = (function() {
  return function(newHeader) {
    return {
      findMatch: findMatch
    };

    function findMatch(flattened) {
      var match = {
        header: newHeader,
        isMatch: false,
        headerObj: {}
      };
      return Promise.each(flattened, isMatch).then(function() {
        return { header: match, match: match.isMatch };
      });

      ///////////////////////

      function isMatch(header) {
        var oldH = _.sortBy(header.values, sort);
        var newH = _.sortBy(newHeader, sort);
        if (_.isEqual(oldH, newH)) {
          match.header = header.keys;
          match.isMatch = true;
          match.headerObj = header.headerObj;
        }

        //////////////////

        function sort(val) {
          return val;
        }
      }
    }
  };
})();
