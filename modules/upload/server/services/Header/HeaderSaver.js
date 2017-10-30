"use strict";

var mongoose = require("mongoose");
var Header = mongoose.model("Header");
var Promise = require("bluebird");
var _ = require("underscore");

module.exports = (function() {
  var excludeKeys = ["_id", "__v", "OriginalFile"];

  return function() {
    return { save: save };

    function save(headerToSave) {
      if (!headerToSave.MobilePhone && !headerToSave.HomePhone) {
        return Promise.reject("Invalid Header");
      }
      var header = new Header(headerToSave);

      return header.save().then(format);

      function format(header) {
        return {
          header: {
            header: Object.keys(header.toJSON())
              .map(keys)
              .filter(filterUndefined),
            headerObj: header
          }
        };

        ///////////////////////

        function filterUndefined(val) {
          return !!val;
        }

        function keys(key) {
          if (excludeKeys.indexOf(key) === -1) {
            return key;
          }
        }
      }
    }
  };
})();
