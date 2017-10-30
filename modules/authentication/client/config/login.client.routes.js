(function() {
  "use strict";

  angular.module("auth").config(loginConfig);

  loginConfig.$inject = ["$routeProvider"];

  function loginConfig($routeProvider) {
    $routeProvider.when("/login", {
      templateUrl: "/authentication/client/views/login.client.view.html",
      controllerAs: "vm"
    });
  }
})();
