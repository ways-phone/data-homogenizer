(function() {
  "use strict";

  angular.module("files").factory("FileService", FileService);

  FileService.$inject = ["$resource", "$routeParams", "$q"];

  function FileService($resource, $routeParams, $q) {
    var resource = $resource("/api/:acronym/:path/files", {
      path: "@path",
      acronym: "@acronym"
    });
    var service = {
      deleteFile: deleteFile,
      retrieveFileDetails: retrieveFileDetails,
      retrieveAllFiles: retrieveAllFiles
    };

    return service;

    function retrieveAllFiles() {
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

    function retrieveFileDetails(id) {
      var deferred = $q.defer();

      var retrieveFile = new resource({ File: id });

      retrieveFile.$save($routeParams, function(response) {
        if (response.error) {
          deferred.reject(response.error);
        } else {
          deferred.resolve(response.data);
        }
      });

      return deferred.promise;
    }

    function deleteFile(id) {
      var deferred = $q.defer();

      var del = new resource({ File: id });

      var route = angular.copy($routeParams);

      route.File = id;

      resource.delete(route, function(response) {
        if (response.error) deferred.reject(response.error);
        else deferred.resolve(response.data);
      });

      return deferred.promise;
    }
  }
})();
