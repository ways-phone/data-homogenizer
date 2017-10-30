(function() {
  "use strict";

  angular.module("sources").factory("SourceService", SourceService);

  SourceService.$inject = ["$resource", "$routeParams", "$q"];

  function SourceService($resource, $routeParams, $q) {
    var resource = $resource(
      "api/:acronym/:path/sources",
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
      postSource: postSource,
      getSources: getSources,
      editSource: editSource,
      overwriteCost: overwriteCost
    };

    return service;

    function getSources() {
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

    function postSource(source) {
      var deferred = $q.defer();

      var Source = new resource(source);
      Source.$save($routeParams, function(response) {
        if (response.error) {
          deferred.reject(response.error);
        } else {
          deferred.resolve(response.data);
        }
      });

      return deferred.promise;
    }

    function editSource(source) {
      var deferred = $q.defer();

      var editedSource = new resource({ Source: source });
      resource.update($routeParams, editedSource, function(response) {
        if (!!response.error) {
          deferred.reject(response.error);
        } else {
          deferred.resolve(response.data);
        }
      });

      return deferred.promise;
    }

    function overwriteCost(source, start, end) {
      var deferred = $q.defer();
      var costResource = $resource("/api/:acronym/:path/sources/cost");

      var UpdateCost = new costResource({
        Source: source,
        Start: start,
        End: end
      });

      UpdateCost.$save($routeParams, function(response) {
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
