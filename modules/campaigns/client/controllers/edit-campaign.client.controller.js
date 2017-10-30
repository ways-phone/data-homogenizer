(function() {
  "use strict";

  angular
    .module("campaigns")
    .controller("EditCampaignController", EditCampaignController);

  EditCampaignController.$inject = [
    "$location",
    "$uibModalInstance",
    "data",
    "CampaignService",
    "ErrorHandler"
  ];

  function EditCampaignController(
    $location,
    $uibModalInstance,
    data,
    CampaignService,
    ErrorHandler
  ) {
    /* jshint validthis:true */
    var vm = this;
    vm.Name = "Campaign";
    vm.campaign = angular.copy(data.Campaign);

    // vm accessible functions
    vm.updateCampaign = updateCampaign;
    vm.closeModal = closeModal;
    vm.closeAlert = closeAlert;

    activate();

    function activate() {}

    // determines if the campaign has been altered
    function hasChanged(oldCampaign, newCampaign) {
      for (var key in newCampaign) {
        var oldAttr = oldCampaign[key];
        var newAttr = newCampaign[key];

        if (
          newAttr !== oldAttr &&
          !(isEmptyArray(newAttr) && isEmptyArray(oldAttr))
        ) {
          return true;
        }
      }
      return false;
    }

    // returns true if the array is empty
    function isEmptyArray(arr) {
      return Array.isArray(arr) && arr.length === 0;
    }

    // posts the updated campaign to the server
    function updateCampaign() {
      if (hasChanged(data.Campaign, vm.campaign)) {
        CampaignService.updateCampaign(vm.campaign)
          .then(closeModal)
          .catch(handleError);
      } else {
        closeModal();
      }
    }

    // closes the modal if a client is passed in or dismisses it
    function closeModal(client) {
      if (client) {
        $uibModalInstance.close(client);
      } else {
        $uibModalInstance.dismiss("cancel");
      }
    }

    // uses ErrorHandler Service to handle errors. Resets the Campaign
    function handleError(error) {
      vm.error = ErrorHandler.handleError(error, vm.Name);
      vm.campaign = data.Campaign;
    }

    // closes the error message
    function closeAlert() {
      vm.error = "";
    }
  }
})();
