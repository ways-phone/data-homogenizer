(function() {
  "use strict";

  angular.module("list").factory("AggregateFormatter", AggregateFormatter);

  AggregateFormatter.inject = [];

  function AggregateFormatter() {
    var AggregateFormatter = {
      format: format
    };

    return AggregateFormatter;

    ////////////////
    function format(counts) {
      if (!counts || counts.length < 1) return;
      return formatRecordAggregates(counts);
    }

    function formatRecordAggregates(counts) {
      var rows = formatRows(counts);
      var header = formatKeys(rows[0]);

      return { rows: rows, header: header };
    }

    function formatRows(rows) {
      rows.forEach(formatRow);
      return rows;
      ////////////////

      function formatRow(row) {
        var name;
        var data = row._id;
        var nested = ["Source", "File"];
        Object.keys(data).forEach(flattenNestedObjects);

        ///////////////////

        function flattenNestedObjects(key) {
          if (nested.indexOf(key) !== -1) {
            var source = data[key];
            row[key] = data[key].DisplayName || data[key].Name;
            row._id[key] = data[key];
          } else {
            row[key] = data[key] || "";
          }
        }
      }
    }

    function formatKeys(row) {
      var keys = [];

      Object.keys(row).forEach(addKeyIfnotEqualTo_Id);

      reorder(keys, keys.indexOf("count"));

      return keys;

      /////////////////////////

      function addKeyIfnotEqualTo_Id(key) {
        if (key === "_id") return;
        keys.push(key);
      }

      function reorder(arr, index) {
        arr.push(arr.splice(index, 1)[0]);
      }
    }
  }
})();
