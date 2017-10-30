(function() {
  "use strict";

  angular.module("campaigns").controller("ClientCtrl", ClientCtrl);

  ClientCtrl.$inject = [
    "$location",
    "EditClient",
    "ModalService",
    "authentication"
  ];

  function ClientCtrl($location, EditClient, ModalService, authentication) {
    /* jshint validthis:true */
    var vm = this;
    vm.client = {};

    // vm accessible functions
    vm.addCampaignModal = addCampaignModal;
    vm.editCampaignModal = editCampaignModal;
    vm.deleteCampaignModal = deleteCampaignModal;
    vm.openCampaignPage = openCampaignPage;

    vm.sort = sort;
    activate();

    // initialized the page by grabbing the client then formatting the campaigns
    function activate() {
      authentication.authenticate();
      EditClient.getClient()
        .then(setClientAndCountOnVM)
        .catch(handleError);

      function setClientAndCountOnVM(data) {
        vm.client = data.client;
        vm.count = data.count;
      }
    }
    // opens the add campaign modal
    function addCampaignModal() {
      var modalInstance = ModalService.createModal({
        location: "campaigns",
        name: "Add-Campaign",
        size: "md"
      });

      modalInstance.result.then(bind).catch(handleError);

      function bind(client) {
        vm.client = client;
      }
    }

    // opens the edit campaign modal
    function editCampaignModal(index) {
      var modalInstance = ModalService.createModal({
        location: "campaigns",
        name: "Edit-Campaign",
        size: "md",
        resolve: {
          Campaign: vm.client.Campaigns[index]
        }
      });

      modalInstance.result.then(bind).catch(handleError);

      function bind(client) {
        vm.client = client;
      }
    }

    // TODO: opens the delete campaign modal
    function deleteCampaignModal() {}

    // redirects to campaign page
    function openCampaignPage(id) {
      var selectedCampaign = vm.client.Campaigns.filter(function(c) {
        return c._id === id;
      })[0];

      $location.path("/" + vm.client.Acronym + "/" + selectedCampaign.Path);
    }

    // TODO: hook up to ErrorHandler Service
    function handleError(error) {
      console.log(error);
    }

    function sort(key) {
      vm.sortKey = key;
      console.log(key);
      if (vm.sortKey === key) {
        vm.reverse = !vm.reverse;
      }
    }
  }
})();
