(function() {
  "use strict";

  angular.module("campaigns").config(configConfig);

  configConfig.$inject = ["$routeProvider"];

  function configConfig($routeProvider) {
    $routeProvider.when("/client/:acronym/", {
      templateUrl: "/campaigns/client/views/campaigns.client.view.html",
      controllerAs: "vm",
      acronym: "@Acronym"
    });
  }
})();
