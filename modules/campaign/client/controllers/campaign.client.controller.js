(function() {
  "use strict";
  angular
    .module("campaign")
    .controller("CampaignController", CampaignController);

  CampaignController.$inject = [
    "SingleCampaignService",
    "authentication",
    "Navigation",
    "RecordCountService",
    "DateFormat"
  ];

  function CampaignController(
    SingleCampaignService,
    authentication,
    Navigation,
    RecordCountService,
    DateFormat
  ) {
    /* jshint validthis:true */
    var vm = this;

    vm.campaign = {};
    vm.client = {};

    vm.nav = Navigation;
    vm.sort = sort;

    activate();

    function activate() {
      authentication.authenticate();
      vm.isLoading = true;
      getCampaignAndRecordCount().then(getSourceCountsByFile);
    }

    function getCampaignAndRecordCount() {
      return getCampaign().then(getRecordCount);
    }

    function getSourceCountsByFile() {
      SingleCampaignService.getSourceCountsByFile().then(function(results) {
        var tracker = [];
        results.forEach(function(row) {
          row.forEach(function(result) {
            result.created = DateFormat.createTimestamp(result.created);
            tracker.push(result);
          });
        });

        vm.trackerTable = tracker;
      });
    }

    // Gets a Single Campaign
    function getCampaign() {
      return SingleCampaignService.getCampaign()
        .then(setCampaignOnViewModel)
        .catch(handleError);
    }

    // gets the number of records and their statuses
    function getRecordCount() {
      return SingleCampaignService.getRecordCount()
        .then(setCount)
        .catch(setCount);
    }

    // replaces the view model campaign and client with the data passed back from
    // the modal
    function setCampaignOnViewModel(data) {
      vm.campaign = data.campaign;
      vm.client = data.client;
    }

    function setCount(data) {
      vm.count = RecordCountService.createCounts(data, vm.campaign);
      vm.isLoading = false;
    }

    function handleError(error) {
      console.log(error);
      vm.isLoading = false;
    }

    function sort(key) {
      vm.sortKey = key;
      if (vm.sortKey === key) {
        vm.reverse = !vm.reverse;
      }
    }
  }
})();
