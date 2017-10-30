(function() {
  "use strict";

  angular.module("exclusion").factory("ExclusionService", ExclusionService);

  ExclusionService.$inject = ["dependency1"];

  function ExclusionService(dependency1) {
    var service = {
      exposedFn: exposedFn
    };

    return service;

    ////////////////
    function exposedFn() {}
  }
})();
