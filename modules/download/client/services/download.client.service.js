(function() {
  "use strict";

  angular.module("download").factory("DownloadService", DownloadService);

  DownloadService.$inject = ["$q", "$routeParams", "$resource"];

  function DownloadService($q, $routeParams, $resource) {
    var resource = $resource("/api/:acronym/:path/download", {
      path: "@path",
      acronym: "@acronym"
    });
    var DownloadService = {
      retrieveRecords: retrieveRecords,
      prepareDownload: prepareDownload
    };

    return DownloadService;

    ////////////////
    function retrieveRecords(query) {
      var deferred = $q.defer();
      var api = new resource($routeParams);
      api.$get(query, function(response) {
        if (!!response.error) {
          deferred.reject(response.error);
        } else {
          deferred.resolve(response.data);
        }
      });
      return deferred.promise;
    }

    function prepareDownload(query, config, type, recordState) {
      var downloadQuery = setQuery();
      setQueryStatesForDownloadAndFileName();

      return {
        config: config,
        query: downloadQuery
      };

      //////////////////////////////

      function setQuery() {
        if (type.byFile) {
          config.file = query;
          return { File: query._id };
        } else if (type.bySource) {
          config.source = query;
          return {
            Source: query._id,
            Created: { $gte: config.start, $lt: config.end }
          };
        } else if (type.byList) {
          config.list = query;
          return { List: query._id };
        } else {
          return {
            Campaign: config.campaign._id,
            Created: { $gte: config.start, $lt: config.end }
          };
        }
      }

      function setQueryStatesForDownloadAndFileName() {
        if (recordState !== "Clean") {
          config.recordStates = {
            isDuplicate: true,
            isDuplicateWithinFile: true,
            isInvalid: true
          };

          downloadQuery.$or = {
            isDuplicate: true,
            isDuplicateWithinFile: true
          };
        } else {
          downloadQuery.isInvalid = false;
        }
      }
    }
  }
})();
