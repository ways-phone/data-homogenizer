(function() {
  "use strict";
  angular.module("campaign").config(configConfig);

  configConfig.$inject = ["$routeProvider"];

  function configConfig($routeProvider) {
    $routeProvider.when("/:acronym/:path", {
      templateUrl: "/campaign/client/views/campaign.client.view.html",
      controllerAs: "vm"
      // acronym: "@Acronym",
      // path: "@Path"
    });
  }
})();
