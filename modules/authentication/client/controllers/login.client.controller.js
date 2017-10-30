(function() {
  "use strict";

  angular.module("auth").controller("LoginController", LoginController);

  LoginController.$inject = ["$location", "$window", "authentication"];
  function LoginController($location, $window, authentication) {
    var vm = this;

    vm.user = {
      email: "",
      password: ""
    };

    vm.login = login;

    activate();

    ////////////////

    function login() {
      authentication.login(vm.user).then(function() {
        $window.open("/", "_self");
      });
    }

    function activate() {
      if (authentication.isLoggedIn()) {
        $location.path("/");
      }
    }
  }
})();
