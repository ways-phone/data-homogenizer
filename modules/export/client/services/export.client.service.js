(function() {
  "use strict";

  angular.module("export").factory("ExportService", ExportService);

  ExportService.$inject = ["$q", "$resource", "$routeParams"];

  function ExportService($q, $resource, $routeParams) {
    var resource = $resource(
      "/api/:acronym/:path/export",
      {
        acronym: "@Acronym",
        path: "@Path"
      },
      {
        update: {
          method: "PUT"
        },
        patch: {
          method: "PATCH"
        }
      }
    );

    var ExportService = {
      createDataset: createDataset,
      retrieveDatasets: retrieveDatasets,
      addListToDataset: addListToDataset,
      pushRecords: pushRecords,
      deleteDataset: deleteDataset
    };

    return ExportService;

    ////////////////

    function retrieveDatasets() {
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

    function addListToDataset(dataset, lists) {
      var deferred = $q.defer();
      var datasetToUpdate = new resource({
        Dataset: dataset,
        Lists: lists
      });
      resource.update($routeParams, datasetToUpdate, function(response) {
        if (response.error) {
          deferred.reject(response.error);
        } else {
          deferred.resolve(response.data);
        }
      });
      return deferred.promise;
    }

    function pushRecords(dataset) {
      var deferred = $q.defer();
      var datasetToPush = new resource({
        Dataset: dataset
      });
      resource.patch($routeParams, datasetToPush, function(response) {
        if (response.error) {
          deferred.reject(response.error);
        } else {
          deferred.resolve(response.data);
        }
      });
      return deferred.promise;
    }

    function createDataset(config) {
      var deferred = $q.defer();
      var listToExport = new resource({
        Config: config
      });
      listToExport.$save($routeParams, function(response) {
        if (response.error) {
          deferred.reject(response.error);
        } else {
          deferred.resolve(response.data);
        }
      });

      return deferred.promise;
    }

    function deleteDataset(dataset) {
      var deferred = $q.defer();
      // var listToDelete = new resource({Dataset: dataset});
      var route = angular.copy($routeParams);
      route.Dataset = dataset._id;
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
