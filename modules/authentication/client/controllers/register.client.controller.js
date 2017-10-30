(function() {
  "use strict";

  angular.module("auth").controller("RegisterController", RegisterController);

  RegisterController.$inject = ["$location", "authentication"];
  function RegisterController($location, authentication) {
    var vm = this;

    vm.user = {
      FirstName: "",
      LastName: "",
      Email: "",
      Password: "",
      Department: ""
    };
    vm.departments = ["Operations", "Data", "Client Services"];

    vm.register = register;

    activate();

    ////////////////

    function register() {
      authentication.register(vm.user);
    }

    function activate() {
      // authentication.authenticate();
    }
  }
})();
