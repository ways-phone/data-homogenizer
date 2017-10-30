(function() {
  "use strict";

  angular.module("campaigns").factory("EditClient", EditClient);

  EditClient.$inject = ["$resource", "$q", "$routeParams"];

  function EditClient($resource, $q, $routeParams) {
    var resource = $resource("api/client/:acronym/", {
      acronym: "@Acronym"
    });

    return {
      getClient: getClient
    };

    // gets the selected client object from the db
    function getClient() {
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
  }
})();
