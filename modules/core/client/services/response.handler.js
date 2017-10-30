(function() {
  "use strict";

  angular.module("core").factory("ResponseHandler", ResponseHandler);

  ResponseHandler.$inject = [];

  function ResponseHandler() {
    var service = function(deferred) {
      return function(response) {
        if (!!response.error) {
          deferred.reject(response.error);
        } else {
          deferred.resolve(response.data);
        }
      };
    };
    return service;
  }
})();
