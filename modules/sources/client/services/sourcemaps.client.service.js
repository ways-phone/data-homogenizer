(function() {
  "use strict";

  angular.module("sources").factory("SourcemapService", SourcemapService);

  SourcemapService.$inject = ["$resource", "$q", "$routeParams"];

  function SourcemapService($resource, $q, $routeParams) {
    var resource = new $resource("/api/:acronym/:path/sourcemaps");

    var service = {
      loadSourceMaps: loadSourceMaps,
      deleteSourceMap: deleteSourceMap
    };

    return service;

    function loadSourceMaps() {
      var deferred = $q.defer();

      resource.get($routeParams, function(response) {
        if (response.error) {
          deferred.reject(response.error);
        } else {
          deferred.resolve(response.data);
        }
      });

      return deferred.promise;
    }

    function deleteSourceMap(id) {
      var deferred = $q.defer();

      var route = angular.copy($routeParams);
      route.map = id;

      resource.delete(route, function(response) {
        if (response.error) {
          deferred.reject(response.error);
        } else {
          deferred.resolve(response.data);
        }
      });

      return deferred.promise;
    }
  }
})();
