"use strict";

var Promise = require("bluebird");

module.exports = (function RecordFormatter() {
  var nested = ["Source", "Campaign", "Client", "File", "List"];

  return {
    format: format
  };

  ////////////////////////////////////////////////

  function format(records) {
    return Promise.map(records, formatRecord);
  }

  function formatRecord(record) {
    var formatted = {};

    Object.keys(record).forEach(function(key) {
      if (nested.indexOf(key) !== -1 && record[key]) {
        formatted[key] = record[key].DisplayName || record[key].Name;
      } else {
        formatted[key] = record[key];
      }
    });

    return formatted;
  }
})();
