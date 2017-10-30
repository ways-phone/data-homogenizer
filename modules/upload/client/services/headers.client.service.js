(function() {
  "use strict";

  angular.module("upload").factory("HeaderService", HeaderService);

  HeaderService.$inject = [
    "$q",
    "$resource",
    "$routeParams",
    "Papa",
    "FileParser"
  ];

  function HeaderService($q, $resource, $routeParams, Papa, FileParser) {
    var resource = $resource(
      "/api/:acronym/:path/headers",
      {
        acronym: "@Acronym",
        path: "@Path"
      },
      {
        update: {
          method: "PUT"
        }
      }
    );

    var service = {
      checkHeader: checkHeader,
      getUniversalHeaders: getUniversalHeaders,
      postHeaderMap: postHeaderMap,
      createMap: createMap,
      isMapComplete: isMapComplete,
      getMapLength: getMapLength
    };
    var _this = {};

    return service;

    // posts the header of the data to the server to see if a mapping exists for it
    function checkHeader(header) {
      var deferred = $q.defer();
      var route = angular.copy($routeParams);
      route.Header = header;
      var checkHeader = new resource(route);

      checkHeader.$save(route, function(response) {
        if (!!response.error) {
          deferred.reject(response.error);
        } else {
          deferred.resolve(response.data);
        }
      });

      return deferred.promise;
    }

    // gets the standard headers for the db to populate the select fields
    function getUniversalHeaders() {
      var deferred = $q.defer();

      resource.get($routeParams, function(response) {
        if (!!response.error) {
          deferred.reject(response.error);
        } else {
          deferred.resolve(response.data);
        }
      });

      return deferred.promise;
    }

    // posts the new header mapping back to the server
    function postHeaderMap(map) {
      var deferred = $q.defer();
      resource.update(
        $routeParams,
        {
          map: map
        },
        function(response) {
          if (!!response.error) {
            deferred.reject(response.error);
          } else {
            deferred.resolve(response.data);
          }
        }
      );
      return deferred.promise;
    }

    //creates a header map object out of a new and old header
    function createMap(newHeader, oldHeader) {
      if (newHeader && oldHeader) {
        var headerMap = {};
        newHeader.forEach(function(header, index) {
          headerMap[header] = oldHeader[index];
        });
        return headerMap;
      } else {
        throw new Error("Header mapping not created!");
      }
    }

    // checks whether the header map is filled completely
    function isMapComplete(newHeader, oldHeader) {
      if (newHeader.length === oldHeader.length) {
        for (var i = 0; i < newHeader.length; i++) {
          if (newHeader[i] === undefined || newHeader[i] === "") {
            return false;
          }
        }
        return true;
      } else {
        return false;
      }
    }

    // counts and returns the number of keys in the header map object
    function getMapLength(headerMap) {
      var counter = 0;
      for (var key in headerMap) {
        counter++;
      }
      return counter;
    }
  }
})();
