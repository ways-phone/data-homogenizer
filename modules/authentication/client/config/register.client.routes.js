(function() {
  "use strict";

  angular.module("auth").config(registerConfig);

  registerConfig.$inject = ["$routeProvider"];

  function registerConfig($routeProvider) {
    $routeProvider.when("/register", {
      templateUrl: "/authentication/client/views/register.client.view.html",
      controllerAs: "vm"
    });
  }
})();
