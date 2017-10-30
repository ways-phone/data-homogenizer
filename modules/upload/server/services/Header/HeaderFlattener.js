"use strict";

var mongoose = require("mongoose");
var Header = mongoose.model("Header");
var Promise = require("bluebird");

module.exports = (function() {
  var exclude = ["_id", "__v", "Campaign", "Client", "OriginalFile"];

  return function(campaign) {
    return {
      flatten: flatten
    };

    function flatten() {
      return getAllHeaders().then(flattenHeaders);
    }

    function getAllHeaders() {
      return Header.find({ Campaign: campaign._id });
    }

    function flattenHeaders(headers) {
      var exclude = ["_id", "__v", "Campaign", "Client", "OriginalFile"];
      return Promise.map(headers, flattenHeader);

      ///////////////////////

      function flattenHeader(header) {
        return {
          _id: header._id,
          keys: Object.keys(header.toJSON())
            .map(keys)
            .filter(removeUndefined),
          values: Object.keys(header.toJSON())
            .map(values)
            .filter(removeUndefined),
          headerObj: header
        };

        ////////////////////////////

        function keys(key) {
          if (exclude.indexOf(key) === -1) {
            return key;
          }
        }

        function values(key) {
          if (exclude.indexOf(key) === -1) {
            return header[key];
          }
        }

        function removeUndefined(element) {
          return !!element;
        }
      }
    }
  };
})();
