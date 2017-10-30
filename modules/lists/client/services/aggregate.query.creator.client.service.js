(function() {
  "use strict";

  angular
    .module("list")
    .factory("AggregateQueryCreator", AggregateQueryCreator);

  AggregateQueryCreator.inject = [];

  function AggregateQueryCreator() {
    var AggregateQueryCreator = {
      create: create
    };

    return AggregateQueryCreator;

    ////////////////
    function create(row) {
      var query = {};
      query.search = createQuery(row);
      query.count = angular.copy(row.count);
      return query;
    }

    function createQuery(row) {
      var query = {};
      var exclude = ["count", "$$hashKey", "_id"];
      var nested = ["File", "Source"];

      Object.keys(row).forEach(convertNestedObjectsToString);
      setRecordStatusBools();

      return query;

      //////////////////////

      function convertNestedObjectsToString(key) {
        if (exclude.indexOf(key) !== -1) return;

        if (nested.indexOf(key) !== -1) {
          query[key] = row._id[key];
        } else {
          query[key] = row[key];
        }
      }

      function setRecordStatusBools() {
        query.isInvalid = false;
        query.isExcluded = false;
        query.List = null;
        query.isExported = false;
      }
    }
  }
})();
