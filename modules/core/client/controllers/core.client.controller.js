(function() {
  "use strict";

  angular.module("core").controller("CoreCtrl", CoreController);

  CoreController.$inject = [
    "$location",
    "$uibModal",
    "ClientService",
    "ModalService",
    "authentication"
  ];

  function CoreController(
    $location,
    $uibModal,
    ClientService,
    ModalService,
    authentication
  ) {
    /* jshint validthis:true */

    var vm = this;
    vm.Name = "Client";
    vm.clients = [];

    // vm accessible functions
    vm.openClientPage = openClientPage;
    vm.addClientModal = addClientModal;
    vm.editClientModal = editClientModal;
    vm.deleteClientModal = deleteClientModal;

    vm.sort = sort;

    activate();

    function activate() {
      authentication.authenticate();
      renderClients();
    }

    function renderClients() {
      ClientService.receiveClients()
        .then(setClientsOnVM)
        .catch(handleError);

      //////////////////////////////

      function setClientsOnVM(clients) {
        vm.clients = clients;
      }
    }

    function addClientModal() {
      var modalInstance = ModalService.createModal({
        location: "core",
        name: "Add-Client",
        size: "md"
      });

      modalInstance.result.then(addClientToVM).catch(handleError);

      function addClientToVM(client) {
        vm.clients.push(client);
      }
    }

    function editClientModal(index) {
      var modalInstance = ModalService.createModal({
        location: "core",
        name: "Edit-Client",
        resolve: {
          Client: vm.clients[index]
        },
        size: "md"
      });

      modalInstance.result.then(replaceVmClient);

      //////////////////////////////////////

      function replaceVmClient(client) {
        vm.clients = vm.clients.map(function(existing) {
          if (existing._id === client._id) existing = client;
          return existing;
        });
      }
    }

    function deleteClientModal(index) {
      var modalInstance = ModalService.createModal({
        location: "core",
        name: "Delete-Client",
        resolve: {
          Client: vm.clients[index]
        },
        size: "md"
      });

      modalInstance.result.then(removeClient).catch(handleError);

      ////////////////////////////////////

      function removeClient(client) {
        ClientService.removeClient(client._id)
          .then(removeClientFromVM)
          .catch(handleError);

        //////////////////////////////

        function removeClientFromVM(client) {
          vm.clients = vm.clients.filter(function(existing) {
            return existing.Name !== client.Name;
          });
        }
      }
    }

    function openClientPage(id) {
      var selectedClient = vm.clients.filter(function(t) {
        return t._id === id;
      })[0];

      $location.path("/client/" + selectedClient.Acronym + "/");
    }

    function handleError(error) {
      console.log(error);
    }

    function sort(key) {
      vm.sortKey = key;
      if (vm.sortKey === key) {
        vm.reverse = !vm.reverse;
      }
    }
  }
})();
