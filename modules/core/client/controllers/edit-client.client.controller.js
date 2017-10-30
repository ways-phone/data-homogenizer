(function() {
  "use strict";

  angular
    .module("core")
    .controller("EditClientController", EditClientController);

  EditClientController.$inject = [
    "$uibModalInstance",
    "ClientService",
    "data",
    "ErrorHandler"
  ];

  function EditClientController(
    $uibModalInstance,
    ClientService,
    data,
    ErrorHandler
  ) {
    /* jshint validthis:true */
    var vm = this;
    vm.Name = "Client";

    // vm accessible functions
    vm.client = angular.copy(data.Client);
    vm.closeModal = closeModal;
    vm.closeAlert = closeAlert;
    vm.updateClient = updateClient;

    activate();

    function activate() {}

    function updateClient() {
      if (hasChanged(data.Client, vm.client)) {
        ClientService.updateClient(vm.client)
          .then(closeModal)
          .catch(handlError);
      } else {
        closeModal();
      }
    }

    // determines if the client has actually changed
    function hasChanged(oldClient, newClient) {
      for (var key in newClient) {
        var oldAttr = oldClient[key];
        var newAttr = newClient[key];

        if (
          newAttr !== oldAttr &&
          !(isEmptyArray(newAttr) && isEmptyArray(oldAttr))
        ) {
          return true;
        }
      }
      return false;
    }

    // returns true if array is empty
    function isEmptyArray(arr) {
      return Array.isArray(arr) && arr.length === 0;
    }

    // closes the modal and returns the new client model updated
    function closeModal(client) {
      if (client) {
        $uibModalInstance.close(client);
      } else {
        $uibModalInstance.dismiss("cancel");
      }
    }

    // handles errors
    function handlError(error) {
      vm.error = ErrorHandler.handleError(error, vm.Name);
      vm.client = data.Client;
    }

    // closes error message
    function closeAlert() {
      vm.error = "";
    }
  }
})();
