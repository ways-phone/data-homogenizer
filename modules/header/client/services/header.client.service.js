(function() {
  "use strict";

  angular.module("header").factory("HeaderMapService", HeaderMapService);

  HeaderMapService.$inject = ["$q", "$routeParams", "$resource"];

  function HeaderMapService($q, $routeParams, $resource) {
    var resource = $resource("/api/:acronym/:path/edit-header", {
      acronym: "@acronym",
      path: "@path",
      header_id: "@_id"
    });
    var singleHeader = $resource("/api/:acronym/:path/edit-header/:header_id", {
      acronym: "@acronym",
      path: "@Path",
      header_id: "@_id"
    });

    var HeaderMapService = {
      retrieveHeaders: retrieveHeaders,
      getSingleHeader: getSingleHeader,
      deleteHeader: deleteHeader,
      formatHeaders: formatHeaders
    };

    return HeaderMapService;

    ////////////////
    function retrieveHeaders(path) {
      var deferred = $q.defer();

      resource.get($routeParams, function(response) {
        if (!!response.error) deferred.reject(response.error);
        else deferred.resolve(response.data);
      });

      return deferred.promise;
    }

    function getSingleHeader(header_id) {
      var deferred = $q.defer();
      $routeParams.header_id = header_id;
      singleHeader.get($routeParams, function(response) {
        if (!!response.error) deferred.reject(response.error);
        else deferred.resolve(response.data);
      });
      return deferred.promise;
    }

    function deleteHeader(header_id) {
      var deferred = $q.defer();
      $routeParams.header_id = header_id;
      singleHeader.delete($routeParams, function(response) {
        if (!!response.error) deferred.reject(response.error);
        else deferred.resolve(response.data);
      });
      return deferred.promise;
    }

    function formatHeaders(headers) {
      var keys = getUniversalKeys(headers[0]);

      return createRowArray(headers, keys);

      ///////////////////////////////

      function getUniversalKeys(header) {
        var keys = [];
        var exclude = ["__v", "Campaign", "Client"];
        Object.keys(header).forEach(flattenHeader);

        return keys;

        ////////////////////////////////

        function flattenHeader(key) {
          if (key === "OriginalFile") keys.splice(0, 0, key);
          else if (exclude.indexOf(key) === -1) keys.push(key);
        }
      }

      function createRowArray(headers, keys) {
        var rows = [];
        headers.forEach(iterateHeaders);
        return {
          tableData: rows,
          keys: keys
        };

        ////////////////////////

        function iterateHeaders(header) {
          var row = [];
          keys.forEach(iterateKeys);
          rows.push(row);

          ////////////////////////

          function iterateKeys(key) {
            if (!header[key]) row.push("");
            else row.push(header[key].Name || header[key]);
          }
        }
      }
    }
  }
})();
