(function() {
  "use strict";

  angular.module("files").controller("FilesCtrl", ControllerController);

  ControllerController.$inject = [
    "FileService",
    "Navigation",
    "authentication",
    "SingleCampaignService"
  ];

  function ControllerController(
    FileService,
    Navigation,
    authentication,
    SingleCampaignService
  ) {
    var vm = this;

    vm.nav = Navigation;

    vm.fileSources = [];
    vm.fileLists = [];

    vm.selectedFile = {};
    vm.selectFileForDeletion = selectFileForDeletion;
    vm.cancelDeletion = cancelDeletion;
    vm.delete = deleteFile;

    vm.sort = sort;
    activate();

    ////////////////

    function activate() {
      authentication.authenticate();
      vm.isLoading = true;
      retreiveCampaignAndFiles();
    }

    function retreiveCampaignAndFiles() {
      getClientAndCampaign()
        .then(retrieveFiles)
        .catch(handleError);
    }

    function getClientAndCampaign() {
      return SingleCampaignService.getCampaign().then(setCampaignAndClient);

      ////////////////////////////////

      function setCampaignAndClient(data) {
        vm.campaign = data.campaign;
        vm.client = data.client;
      }
    }

    function retrieveFiles() {
      FileService.retrieveAllFiles()
        .then(setFilesOnVm)
        .then(setFilesWithExportedListsAsDisabled);

      /////////////////////

      function setFilesOnVm(fileinfo) {
        vm.fileinfo = fileinfo;
        vm.files = fileinfo.all;
        vm.isLoading = false;
      }

      function setFilesWithExportedListsAsDisabled() {
        vm.fileinfo.listFiles.forEach(function(toMarkDisabled) {
          vm.files.forEach(function(file) {
            if (file._id === toMarkDisabled._id) {
              file.disabled = true;
            }
          });
        });
      }
    }

    function deleteFile() {
      FileService.deleteFile(vm.selectedFile._id)
        .then(updateCampaignFiles)
        .catch(function(error) {
          vm.confirmDelete = false;
        });

      //////////////////

      function updateCampaignFiles(updatedCampaign) {
        vm.success = vm.selectedFile.Name + " Has been successfully deleted";
        vm.confirmDelete = false;
        retreiveCampaignAndFiles();
      }
    }

    function cancelDeletion() {
      vm.selectedFile = {};
      vm.confirmDelete = false;
    }

    function selectFileForDeletion(file) {
      vm.success = "";
      vm.selectedFile = file;
      vm.confirmDelete = true;
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
