(function() {
  "use strict";

  angular.module("upload").controller("UploadCtrl", UploadCtrl);

  UploadCtrl.$inject = [
    "UploadService",
    "SingleCampaignService",
    "HeaderService",
    "Navigation",
    "SourceService",
    "SourceUploadService",
    "DateFormat",
    "authentication",
    "UploadFileService"
  ];

  function UploadCtrl(
    UploadService,
    SingleCampaignService,
    HeaderService,
    Navigation,
    SourceService,
    SourceUploadService,
    DateFormat,
    authentication,
    UploadFileService
  ) {
    var vm = this;

    vm.campaign = {};
    vm.client = {};

    var MAPPING = "mapping";
    var SHOW_JSON_RECORDS = "showJSONRecords";
    var CREATE_SOURCE_MAPS = "createSourceMaps";
    var READY_TO_UPLOAD = "readytoUpload";
    var NONE = "";

    // Determines which stage of uploading the user is at
    // shows and hides the respective sections
    vm.state = {
      mapping: false,
      showJSONRecords: false,
      createSourceMaps: false,
      readytoUpload: false
    };

    vm.types = ["", "Stand Alone", "Grid", "Phone Leads"];

    vm.isLoading = false;
    vm.hideMenu = false;

    vm.nav = Navigation;

    // select a file from the hard drive and displays on the page
    vm.uploadFileToBrowser = uploadToBrowser;

    // filled when mapping headers
    vm.selectedHeaders = [];

    // function that is run everytim the header mapping select is changed
    vm.checkMapIsComplete = checkMapIsComplete;

    // posts the header map to the server and stores it before
    // overwriting the headers of the uploaded file
    vm.postMap = postMap;

    ////////////// Set Sources //////////////////////

    vm.existingSources = [];
    vm.sourceMapping = [];

    vm.showMap = false;

    vm.setSources = setSources;
    vm.showSource = setSources.showSource;
    vm.addsource = addsource;
    vm.saveSourceMap = saveSourceMap;

    ///////////////////////////////////////////////////

    vm.submitRecords = submitRecords;

    vm.sort = sort;

    activate();

    function activate() {
      authentication.authenticate();
      vm.isLoading = true;
      getClientAndCampaign()
        .then(getStandardHeaders)
        .then(getSourceMaps)
        .then(function() {
          vm.isLoading = false;
        });

      ///////////////////////////
    }

    function getClientAndCampaign() {
      return SingleCampaignService.getCampaign()
        .then(setCampaignAndClient)
        .catch(handleError);

      //////////////// set campaign on the view model
      function setCampaignAndClient(data) {
        vm.campaign = data.campaign;
        vm.client = data.client;
      }
    }

    function getStandardHeaders() {
      HeaderService.getUniversalHeaders()
        .then(function(headers) {
          vm.universalHeaders = headers;
        })
        .catch(handleError);
    }

    function getSourceMaps() {
      UploadService.getSourceMaps()
        .then(function(maps) {
          vm.maps = maps;
        })
        .catch(handleError);
    }

    ////////////////// Upload File and Check Headers ////////////////

    function uploadToBrowser() {
      clearMessages();
      if (!hasFileBeenUploaded()) return;

      vm.isLoading = true;

      UploadFileService.uploadFileToBrowser(vm.file)
        .then(handleMatch)
        .then(setState)
        .then(fillSources);
    }

    function handleMatch(config) {
      if (config.isMatch) {
        vm.records = config.records;
        vm.header = config.header;
        vm.header_id = config.header_id;
        return SHOW_JSON_RECORDS;
      } else {
        vm.originalRecords = config.originalRecords;
        vm.originalHeader = config.originalHeader;
        return MAPPING;
      }
    }

    function clearMessages() {
      vm.success = "";
      vm.errorMessage = "";
    }

    function hasFileBeenUploaded() {
      if (!vm.file) {
        vm.errorMessage = "No File Selected!";
        return false;
      }
      if (UploadService.filenameExists(vm.campaign.Files, vm.file.name)) {
        vm.errorMessage = "This file has already been uploaded!";
        return false;
      }
      return true;
    }

    //////////////// Create Header Mapping ///////////////////

    function postMap() {
      vm.isLoading = true;
      vm.headerMap = HeaderService.createMap(
        vm.selectedHeaders,
        vm.originalHeader
      );
      vm.errorMessage = "";

      if (!isMapValid()) return;

      HeaderService.postHeaderMap(vm.headerMap)
        .then(uploadToBrowser)
        .catch(handleError);
    }

    function isMapValid() {
      if (HeaderService.getMapLength(vm.headerMap) === vm.originalHeader.length)
        return true;
      else {
        vm.errorMessage =
          "You have a duplicate in your header mapping! Please check what you have selected.";
        vm.isLoading = false;
        return false;
      }
    }

    function checkMapIsComplete() {
      vm.completeMap = HeaderService.isMapComplete(
        vm.selectedHeaders,
        vm.originalHeader
      );
    }

    /////////////// Set Sources /////////////////////

    function fillSources(state) {
      if (state !== SHOW_JSON_RECORDS) {
        vm.isLoading = false;
        return;
      }
      if (!vm.records) {
        vm.isLoading = false;
        return;
      }

      if (SourceUploadService.fillSources(vm.maps, vm.records)) {
        setState(READY_TO_UPLOAD);
      } else {
        setState(SHOW_JSON_RECORDS);
      }
      vm.isLoading = false;
    }

    function setSources() {
      vm.isLoading = true;
      setState(CREATE_SOURCE_MAPS);

      vm.existingSources = SourceUploadService.findExistingSources(vm.records);
      vm.canMap = vm.existingSources.length > 0;
      vm.isLoading = false;
    }

    function saveSourceMap() {
      var config = createSourceMapConfig();

      if (vm.canMap) uploadSourceMap(config);
      else setAllSources();
    }

    function createSourceMapConfig() {
      return {
        sourceMaps: vm.sourceMapping,
        records: vm.records,
        campaign: vm.campaign,
        existingSources: vm.existingSources
      };
    }

    function uploadSourceMap(config) {
      return SourceUploadService.saveSourceMap(config).then(function(data) {
        vm.existingSources = SourceUploadService.findExistingSources(
          vm.records
        );
        vm.showMap = true;
        vm.success = data.length + " Source maps created successfully";
        vm.sourceMapping = [];
        if (vm.existingSources.length === 0) setState(READY_TO_UPLOAD);
        else setState(CREATE_SOURCE_MAPS);
      });
    }

    function setAllSources() {
      if (!vm.selectedSource) return;

      vm.records = SourceUploadService.setAllSources(
        vm.selectedSource,
        vm.records
      );

      vm.showMap = true;
      vm.success = "All Sources Set to: " + vm.selectedSource.DisplayName;
      vm.sourcesSet = true;

      setState(READY_TO_UPLOAD);
    }

    function addsource(sourceForm) {
      vm.source.Campaign = vm.campaign._id;
      if (sourceForm.$valid) {
        SourceService.postSource(vm.source)
          .then(setSourceOnVM)
          .catch(handleError);
      }
      //////////////////

      function setSourceOnVM(data) {
        vm.source = {};
        vm.campaign.Sources.push(DateFormat.setTimestamp(data.source));
      }

      sourceForm.$setPristine();
    }

    ///////////////// Send Completed Records to Server //////////////

    function submitRecords() {
      if (!vm.records) return;

      vm.isLoading = true;
      UploadService.postRecords(vm.records, vm.file.name, vm.header_id)
        .then(setSuccessMessage)
        .catch(handleError);

      // ////////////////////////// sets the success message after a file has been
      // uploaded
      function setSuccessMessage(data) {
        vm.success =
          vm.file.name +
          " uploaded successfully! " +
          data.response.count +
          " records uploaded with " +
          data.response.dupes +
          " duplicate records and " +
          data.response.dupesWithinFile +
          " Duplicates within the file.";
        vm.campaign = data.campaign;

        vm.isLoading = false;
        vm.sourceMapping = [];
        vm.showMap = false;

        setState(NONE);

        activate();
      }
    }

    ////////////////////////// Helper Functions /////////////////////

    function setState(state) {
      Object.keys(vm.state).forEach(function(key) {
        vm.state[key] = key === state;
      });
      return state;
    }

    function sort(key) {
      vm.sortKey = key;
      if (vm.sortKey === key) {
        vm.reverse = !vm.reverse;
      }
    }

    // handles errors
    function handleError(error) {
      console.log(error);
    }
  }
})();
