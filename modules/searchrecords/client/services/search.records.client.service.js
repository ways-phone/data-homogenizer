(function() {
  "use strict";

  angular.module("searchRecords").factory("QueryRecords", QueryRecords);

  QueryRecords.$inject = ["$rootScope", "$q", "$resource"];

  function QueryRecords($rootScope, $q, $resource) {
    var resource = $resource("/api/search-records", {}, {});
    var SearchService = {
      searchRecords: searchRecords,
      updateRecord: updateRecord,
      prepareSearchQuery: prepareSearchQuery,
      isQueryValid: isQueryValid
    };

    return SearchService;

    ////////////////
    function searchRecords(query) {
      var deferred = $q.defer();
      resource.get(query, function(response) {
        if (!!response.error) {
          deferred.reject(response.error);
        } else {
          deferred.resolve(response.data);
        }
      });

      return deferred.promise;
    }

    function updateRecord(id, update) {
      update.Updated = new Date();

      var deferred = $q.defer();
      var updateRecord = new resource({
        id: id,
        update: update
      });

      updateRecord.$save(function(response) {
        if (!!response.error) {
          deferred.reject(response.error);
        } else {
          deferred.resolve(response.data);
        }
      });
      return deferred.promise;
    }

    function prepareSearchQuery(query) {
      var nested = ["Client", "Campaign", "File", "Source", "List"];
      query.Range.start.setHours(0, 0, 0, 0);
      query.Range.end.setHours(23, 59, 59, 59);

      Object.keys(query).forEach(flattenAndRemoveIfNoId);

      return query;
      /////////////////////////////

      function flattenAndRemoveIfNoId(key) {
        if (Object.keys(query[key]).length === 0) {
          delete query[key];
        }
        if (nested.indexOf(key) !== -1) {
          query[key] = query[key]._id;
        }
      }
    }

    function isQueryValid(query, hasDisabledText) {
      if (!query.search) return true;
      return hasDisabledText || !!query.search.searchText;
    }
  }
})();
