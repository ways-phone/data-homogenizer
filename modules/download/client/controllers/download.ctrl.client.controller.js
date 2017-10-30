(function() {
  "use strict";

  angular.module("download").controller("DownloadCtrl", DownloadCtrl);

  DownloadCtrl.$inject = [
    "SingleCampaignService",
    "Navigation",
    "authentication",
    "DateFormat",
    "DatePicker",
    "DownloadFileService",
    "DownloadService"
  ];

  function DownloadCtrl(
    SingleCampaignService,
    Navigation,
    authentication,
    DateFormat,
    DatePicker,
    DownloadFileService,
    DownloadService
  ) {
    var vm = this;

    vm.client = {};
    vm.campaign = {};

    vm.nav = Navigation;

    vm.start = new Date();
    vm.end = new Date();

    vm.downloadType = {
      byCampaign: false,
      byFile: false,
      byList: false,
      bySource: false
    };

    vm.datepicker = DatePicker.Object();
    vm.downloadOptions = ["File", "List", "Source", "Campaign"];
    vm.selectedType = {};
    vm.recordStates = ["Clean", "All"];
    vm.selectedRecordState = "Clean";

    vm.showDownloadOptions = showDownloadOptions;

    vm.download = download;

    vm.sort = sort;
    activate();

    ////////////////

    function activate() {
      authentication.authenticate();
      vm.isLoading = true;
      getClientAndCampaign();
    }

    function getClientAndCampaign() {
      return SingleCampaignService.getCampaign()
        .then(setCampaignAndClient)
        .then(formatFileTimestamps)
        .then(stopLoading)
        .catch(handleError);
    }

    function setCampaignAndClient(data) {
      vm.campaign = data.campaign;
      vm.client = data.client;
    }

    function formatFileTimestamps() {
      vm.campaign.Files.forEach(function(file) {
        file.Created = DateFormat.createTimestamp(file.Created);
        file.Updated = DateFormat.createTimestamp(file.Updated);
      });
    }

    function stopLoading() {
      vm.isLoading = false;
    }

    function showDownloadOptions() {
      var option = "by" + vm.selectedType;

      Object.keys(vm.downloadType).forEach(setOptionTrue);

      ////////////////////

      function setOptionTrue(key) {
        vm.downloadType[key] = key === option;
      }
    }

    function download(query) {
      var preparation = DownloadService.prepareDownload(
        query,
        createConfig(),
        vm.downloadType,
        vm.selectedRecordState
      );
      if (!preparation) {
        preparation = { config: {}, query: {} };
      }

      setFilenameAndHeaders(preparation.config);

      return retrieveRecords(preparation.query);
    }

    function createConfig() {
      return {
        campaign: vm.campaign,
        client: vm.client,
        start: vm.start,
        end: vm.end,
        downloadType: vm.downloadType
      };
    }

    function setFilenameAndHeaders(config) {
      var results = DownloadFileService.prepareFileForDownload(config);

      vm.headers = results.headers;
      vm.filename = results.filename;
    }

    function retrieveRecords(query) {
      return DownloadService.retrieveRecords(query)
        .then(function(records) {
          vm.isLoading = false;
          return records;
        })
        .catch(function(error) {
          vm.isLoading = false;
          console.log(error);
        });
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
