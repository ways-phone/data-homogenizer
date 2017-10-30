(function() {
  "use strict";

  angular.module("header").controller("HeaderCtrl", HeaderCtrl);

  HeaderCtrl.$inject = [
    "HeaderMapService",
    "authentication",
    "Navigation",
    "SingleCampaignService"
  ];

  function HeaderCtrl(
    HeaderMapService,
    authentication,
    Navigation,
    SingleCampaignService
  ) {
    var vm = this;

    /////////////// Navigation ////////////////////

    vm.nav = Navigation;

    //////////////////////////////

    vm.sort = sort;
    vm.selectRow = selectRow;
    vm.deleteHeaderMap = deleteHeaderMap;

    vm.confirmDelete = confirmDelete;

    vm.cancel = cancel;
    vm.cancelDelete = cancelDelete;
    activate();

    ////////////////

    function activate() {
      authentication.authenticate();
      vm.isLoading = true;
      getCampaignAndHeaders().then(function() {
        vm.isLoading = false;
      });

      //////////////////////////
    }

    function getCampaignAndHeaders() {
      return getClientAndCampaign().then(retrieveHeaders);
    }

    function getClientAndCampaign() {
      return SingleCampaignService.getCampaign()
        .then(setCampaignAndClient)
        .catch(handleError);

      /////////////////////////////////

      function setCampaignAndClient(data) {
        vm.campaign = data.campaign;
        vm.client = data.client;
      }
    }

    function retrieveHeaders() {
      return HeaderMapService.retrieveHeaders(vm.campaign.Path)
        .then(HeaderMapService.formatHeaders)
        .then(function(config) {
          vm.tableData = config.tableData;
          vm.keys = config.keys;
        })
        .catch(function(error) {
          console.log(error);
        });
    }

    function selectRow(id) {
      var selected = vm.tableData.filter(filterById)[0];

      createRowObject(selected, vm.keys);

      HeaderMapService.getSingleHeader(vm.row._id)
        .then(function(files) {
          vm.files = files;
        })
        .catch(handleError);

      ///////////////////////////

      function filterById(row) {
        return row[1] === id;
      }

      function createRowObject(row, keys) {
        var rowObj = {};
        keys.forEach(transformArrayToObject);
        vm.selectedHeader = rowObj;
        vm.row = rowObj;
        //////////////////////

        function transformArrayToObject(key, index) {
          rowObj[key] = row[index];
        }
      }
    }

    function deleteHeaderMap() {
      HeaderMapService.deleteHeader(vm.selectedHeader._id)
        .then(function(deleted) {
          retrieveHeaders();
          vm.success = "Header Mapping Successfully Deleted";
          vm.delete = false;
          cancel();
        })
        .catch(function(error) {
          console.log(error);
        });
    }

    function confirmDelete() {
      vm.delete = true;
    }

    function cancel() {
      vm.selectedHeader = "";
    }

    function cancelDelete() {
      vm.delete = false;
    }

    function sort(key) {
      vm.sortKey = key;
      if (vm.sortKey === key) {
        vm.reverse = !vm.reverse;
      }
    }

    function handleError(error) {
      console.log(error);
    }
  }
})();
