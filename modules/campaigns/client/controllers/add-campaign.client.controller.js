(function() {
  "use strict";

  angular
    .module("campaigns")
    .controller("AddCampaignController", AddCampaignController);

  AddCampaignController.$inject = [
    "$location",
    "$uibModalInstance",
    "CampaignService",
    "ErrorHandler",
    "authentication"
  ];

  function AddCampaignController(
    $location,
    $uibModalInstance,
    CampaignService,
    ErrorHandler,
    authentication
  ) {
    /* jshint validthis:true */
    var vm = this;
    vm.Name = "Campaign";
    vm.campaign = {};

    // vm accessible functions
    vm.addCampaign = addCampaign;
    vm.closeModal = closeModal;
    vm.closeAlert = closeAlert;

    activate();

    function activate() {
      if (!authentication.isLoggedIn()) {
        $location.path("/login");
      } else {
        vm.campaign.Creator = authentication.currentUser()._id;
      }
    }

    // posts the newly created to the server
    function addCampaign(form) {
      vm.form = form;
      CampaignService.addCampaign(vm.campaign)
        .then(closeModal)
        .catch(handleError);
    }

    // closes the error message
    function closeAlert() {
      vm.error = "";
    }

    // dismisses the modal if no client is passed otherwise passes the updated
    // client to the campaigns controller
    function closeModal(client) {
      if (client) {
        $uibModalInstance.close(client);
      } else {
        $uibModalInstance.dismiss("cancel");
      }
    }

    // uses the ErrorHandler service to parse errors
    function handleError(error) {
      vm.error = ErrorHandler.handleError(error, vm.Name);
      vm.campaign = {};
      vm.form.$setPristine();
    }
  }
})();
