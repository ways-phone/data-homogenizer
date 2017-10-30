(function() {
  "use strict";

  angular
    .module("core")
    .controller("DeleteClientController", DeleteClientController);

  DeleteClientController.$inject = ["data", "$uibModalInstance"];

  function DeleteClientController(data, $uibModalInstance) {
    /* jshint validthis:true */
    var vm = this;
    vm.client = angular.copy(data.Client);
    vm.closeModal = closeModal;
    vm.deleteClient = deleteClient;

    activate();

    function activate() {}

    function closeModal() {
      $uibModalInstance.dismiss("cancel");
    }
    function deleteClient() {
      $uibModalInstance.close(vm.client);
    }
  }
})();
