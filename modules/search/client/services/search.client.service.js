(function() {
  "use strict";

  angular.module("search").factory("SearchService", SearchService);

  SearchService.$inject = ["$resource", "$q", "authentication"];

  function SearchService($resource, $q, authentication) {
    var resource = $resource(
      "/api/search",
      {},
      {
        get: {
          method: "GET",
          headers: {
            Authorization: authentication.setAuth
          }
        }
      }
    );
    var SearchService = {
      searchRecords: searchRecords,
      updateRecord: updateRecord
    };

    return SearchService;

    ////////////////
    function searchRecords(query) {
      var deferred = $q.defer();
      var data = {
        query: query
      };
      resource.get(data, function(response) {
        if (!!response.error) {
          deferred.reject(response.error);
        } else {
          deferred.resolve(response.data);
        }
      });

      return deferred.promise;
    }

    function updateRecord(record) {
      record.Updated = new Date();
      var deferred = $q.defer();
      var update = new resource(record);

      update.$save(function(response) {
        if (!!response.error) {
          deferred.reject(response.error);
        } else {
          deferred.resolve(response.data);
        }
      });
      return deferred.promise;
    }
  }
})();
