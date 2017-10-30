(function() {
  "use strict";

  angular.module("core").controller("AddClientController", AddClientController);

  AddClientController.$inject = [
    "$uibModalInstance",
    "ClientService",
    "ErrorHandler",
    "authentication"
  ];

  function AddClientController(
    $uibModalInstance,
    ClientService,
    ErrorHandler,
    authentication
  ) {
    /* jshint validthis:true */
    var vm = this;
    vm.Name = "Client";
    vm.error = "";
    vm.client = {};

    // vm accessible functions
    vm.addClient = addClient;
    vm.closeAlert = closeAlert;
    vm.closeModal = closeModal;

    activate();

    function activate() {
      var user = authentication.currentUser();
      if (user !== null) {
        vm.client.Creator = user._id;
      }
      return vm;
    }

    function addClient(clientForm) {
      ClientService.addClient(vm.client)
        .then(closeModalWithClient)
        .catch(function(error) {
          vm.error = ErrorHandler.handleError(error, vm.Name);
          clearForm(clientForm);
        });
    }

    function closeModalWithClient(client) {
      $uibModalInstance.close(client);
    }

    function clearForm(clientForm) {
      vm.client = {};
      clientForm.$setPristine();
    }

    function closeAlert() {
      vm.error = "";
    }

    function closeModal() {
      $uibModalInstance.dismiss("cancel");
    }
  }
})();
