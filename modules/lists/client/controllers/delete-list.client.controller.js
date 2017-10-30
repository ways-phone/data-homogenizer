(function() {
  "use strict";

  angular
    .module("list")
    .controller("DeleteListController", DeleteListController);

  DeleteListController.$inject = ["$uibModalInstance", "ListService", "data"];

  function DeleteListController($uibModalInstance, ListService, data) {
    var vm = this;
    vm.list = data.List;

    vm.dismissModal = dismissModal;
    vm.closeAlert = closeAlert;
    vm.deleteList = deleteList;
    activate();

    ////////////////

    function activate() {}

    function deleteList() {
      console.log("firing");
      ListService.sendDeleteRequest(vm.list._id)
        .then(function(success) {
          $uibModalInstance.close({
            list: vm.list,
            modified: success.nModified
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    }

    function dismissModal() {
      $uibModalInstance.dismiss();
    }

    function closeAlert() {
      vm.deleteSuccess = "";
    }
  }
})();
