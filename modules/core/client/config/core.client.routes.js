(function() {
  "use strict";

  angular.module("core").config(configConfig);

  configConfig.$inject = ["$routeProvider"];

  function configConfig($routeProvider) {
    $routeProvider.when("/", {
      templateUrl: "/core/client/views/core.client.view.html",
      controllerAs: "vm"
    });
  }
})();
