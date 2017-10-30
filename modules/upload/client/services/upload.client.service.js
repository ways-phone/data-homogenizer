(function() {
  "use strict";

  angular.module("upload").factory("UploadService", UploadService);

  UploadService.$inject = ["$q", "$resource", "$routeParams", "Papa"];

  function UploadService($q, $resource, $routeParams, Papa) {
    var resource = $resource(
      "/api/:acronym/:path/records",
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
      postRecords: postRecords,
      filenameExists: filenameExists,
      getSourceMaps: getSourceMaps
    };

    return service;

    // post records back to the server
    function postRecords(records, filename, header_id) {
      var deferred = $q.defer();
      var recordToPost = new resource({
        records: records,
        filename: filename,
        header: header_id
      });

      recordToPost.$save($routeParams, function(response) {
        if (!!response.error) {
          deferred.reject(response.error);
        } else {
          deferred.resolve(response.data);
        }
      });
      return deferred.promise;
    }

    function getSourceMaps() {
      var deferred = $q.defer();
      var sourceResource = $resource("/api/:acronym/:path/source-map");
      sourceResource.get($routeParams, function(response) {
        if (!!response.error) {
          deferred.reject(response.error);
        } else {
          deferred.resolve(response.data);
        }
      });
      return deferred.promise;
    }

    // checks if the uploaded file exists in the DB
    function filenameExists(existingFiles, currentFile) {
      var exists = false;
      if (!existingFiles) return exists;

      existingFiles.forEach(checkFileName);

      return exists;

      ///////////////

      function checkFileName(file) {
        if (stripFileType(file.Name) === stripFileType(currentFile)) {
          exists = true;
        }

        //////////////// strips file type from the file name
        function stripFileType(filename) {
          return filename
            .replace(".xlsx", "")
            .replace(".xls", "")
            .replace(".csv", "");
        }
      }
    }
  }
})();
