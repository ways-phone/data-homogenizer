(function() {
  "use strict";

  angular
    .module("exclusion")
    .controller("ExclusionController", ExclusionController);

  ExclusionController.$inject = [
    "Navigation",
    "SingleCampaignService",
    "FileParser"
  ];

  function ExclusionController(Navigation, SingleCampaignService, FileParser) {
    var vm = this;

    vm.nav = Navigation;
    activate();
    vm.uploadFileToBrowser = uploadFileToBrowser;
    ////////////////

    function activate() {
      vm.loading = true;
      SingleCampaignService.getCampaign().then(function(data) {
        vm.client = data.client;
        vm.campaign = data.campaign;
        vm.isLoading = false;
      });
    }

    function uploadFileToBrowser() {
      FileParser.readFile(vm.file)
        .then(function(raw) {
          // return FileParser.convertExclusionListToJson( raw );
          console.log(raw);
        })
        .then(function(result) {
          console.log(result);
        });
    }
  }
})();
