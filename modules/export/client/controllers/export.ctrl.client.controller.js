(function() {
  "use strict";

  angular.module("export").controller("ExportCtrl", ExportCtrl);

  ExportCtrl.$inject = [
    "authentication",
    "Navigation",
    "SingleCampaignService",
    "DateFormat",
    "ExportService",
    "DatasetNameService"
  ];

  function ExportCtrl(
    authentication,
    Navigation,
    SingleCampaignService,
    DateFormat,
    ExportService,
    DatasetNameService
  ) {
    /* jshint validthis:true */
    var vm = this;

    vm.nav = Navigation;

    vm.state = {
      create: true,
      add: false,
      push: false,
      showLists: false
    };

    vm.selectedLists = [];
    vm.selectedClass = "selected";

    vm.setSelectedList = setSelectedList;
    vm.setState = setState;

    vm.createDataset = createDataset;
    vm.addListTodataset = addListTodataset;
    vm.deleteDataset = deleteDataset;

    vm.sort = sort;
    activate();

    ///////////////////////////

    function activate() {
      authentication.authenticate();
      vm.isLoading = true;
      getCampaignAndFormatLists()
        .then(getDatasets)
        .catch(handleError);
    }

    function getCampaignAndFormatLists() {
      return SingleCampaignService.getCampaign()
        .then(setCampaignAndClient)
        .then(setTimestamp)
        .then(removeExportedLists);

      //////////////////////////

      function setCampaignAndClient(data) {
        vm.campaign = data.campaign;
        vm.client = data.client;
        vm.isLoading = false;
      }

      function removeExportedLists() {
        vm.campaign.Lists = vm.campaign.Lists.filter(function(list) {
          return !list.isExported;
        });
      }

      function setTimestamp() {
        vm.campaign.Lists = vm.campaign.Lists.map(DateFormat.setTimestamp);
      }
    }

    function setSelectedList(list, isAdd) {
      if (isAdd) addListToDataset(list);
      else removeListFromDataset(list);

      setListName();
      ////////////////////////////

      function addListToDataset(list) {
        vm.selectedLists.push(list);
      }

      function removeListFromDataset(list) {
        vm.selectedLists.splice(vm.selectedLists.indexOf(list), 1);
      }

      function setListName() {
        if (vm.selectedLists.length > 0)
          vm.customListName = vm.selectedLists[0].Name;

        vm.customListName = DatasetNameService.createName(
          vm.selectedLists,
          vm.customListName
        );
      }
    }

    function createDataset() {
      var name = vm.customListName || vm.list.Name;

      var lists = vm.selectedLists.map(function(list) {
        delete list.timestamp;
        return list;
      });

      var config = {
        lists: lists,
        name: name
      };

      ExportService.createDataset(config)
        .then(SetSuccess)
        .then(getDatasets)
        .catch(handleError);

      //////////////////////

      function SetSuccess(data) {
        vm.success = data.dataset.Name + " Created successfully";
        vm.selectedLists = [];
        vm.customListName = "";
        activate();
      }
    }

    function getDatasets() {
      return ExportService.retrieveDatasets()
        .then(setDatasets)
        .catch(handleError);

      ///////////////////////////

      function setDatasets(datasets) {
        datasets.forEach(getRecordsInDataset);
        vm.datasets = datasets;

        /////////////////////////////

        function getRecordsInDataset(dataset) {
          var count = 0;
          dataset.List.forEach(function(list) {
            count += list.Count;
          });

          dataset.count = count;
        }
      }
    }

    function addListTodataset() {
      if (vm.selectedLists.length < 1) return;

      ExportService.addListToDataset(vm.dataset, vm.selectedLists)
        .then(handleResponse)
        .catch(handleError);

      ////////////////////

      function handleResponse(data) {
        var count = getCount();
        vm.selectedLists = [];
        getCampaignAndFormatLists();
        var name = vm.dataset.Name;
        vm.setState("add");
        vm.success = count + " Records Added to Dataset: " + name;
        vm.dataset = "";

        ////////////////

        function getCount() {
          var count = 0;
          vm.selectedLists.forEach(function(list) {
            count += list.Count;
          });
          return count;
        }
      }
    }

    function deleteDataset(dataset) {
      ExportService.deleteDataset(dataset)
        .then(function(deleted) {
          vm.success = "Dataset " + deleted.Name + " was successfully deleted";
          getCampaignAndFormatLists();
        })
        .catch(handleError);
    }

    function setState(state, dataset) {
      vm.dataset = dataset;
      vm.success = "";
      vm.error = "";
      Object.keys(vm.state).forEach(setKeyAsTrue);

      ///////////

      function setKeyAsTrue(key) {
        vm.state[key] = key === state;
      }
    }

    function sort(key) {
      vm.sortKey = key;
      if (vm.sortKey === key) {
        vm.reverse = !vm.reverse;
      }
    }

    function handleError(error) {
      console.log(error);
      vm.isLoading = false;
    }
  }
})();
