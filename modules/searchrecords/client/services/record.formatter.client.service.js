(function() {
  "use strict";

  angular.module("searchRecords").factory("RecordFormatter", RecordFormatter);

  RecordFormatter.inject = ["DateFormat"];

  function RecordFormatter(DateFormat) {
    var RecordFormatter = {
      format: format,
      createUpdate: createUpdate
    };

    var dates = ["Created", "Updated"];
    var disabled = ["CustKey", "OriginalCost", "_id", "__v"];

    return RecordFormatter;

    ////////////////
    function format(record) {
      Object.keys(record).forEach(formatRecordFieldsForDisplay);

      return record;

      function formatRecordFieldsForDisplay(key) {
        if (isObject(record[key])) {
          markNestedFieldsAsDisabled();
        }
        var twoLetters = key.slice(0, 2);
        if (twoLetters.toLowerCase() === "is") {
          markFieldsAsDropdown();
        }
        if (dates.indexOf(key) !== -1) {
          formatDateFields();
        }
        if (disabled.indexOf(key) !== -1) {
          markFieldsAsDisabled();
        }
        //////////////////////////////////////

        function markNestedFieldsAsDisabled() {
          record[key] = {
            disabled: true,
            value:
              record[key].DisplayName || record[key].Name || record[key]._id
          };
        }

        function markFieldsAsDropdown() {
          record[key] = {
            select: true,
            bool: String(record[key])
          };
        }

        function markFieldsAsDisabled() {
          record[key] = {
            disabled: true,
            value: record[key]
          };
        }

        function formatDateFields() {
          record[key] = {
            disabled: true,
            value: DateFormat.createTimestamp(record[key])
          };
        }
      }
    }

    function createUpdate(record) {
      var update = {};
      Object.keys(record).forEach(function(key) {
        if (!isObject(record[key])) {
          update[key] = record[key];
        } else if (record[key].select) {
          update[key] = record[key].bool === "true";
        }
      });

      return update;
    }

    function isObject(val) {
      if (val === null) return false;
      return Object.prototype.toString.call(val) === "[object Object]";
    }
  }
})();
