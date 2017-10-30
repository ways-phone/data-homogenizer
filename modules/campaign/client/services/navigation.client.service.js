(function() {
  "use strict";

  angular.module("campaign").factory("Navigation", Navigation);

  Navigation.$inject = ["$location", "$route"];

  function Navigation($location, $route) {
    var service = {
      upload: upload,
      download: download,
      lists: lists,
      sources: sources,
      headers: headers,
      files: files,
      stats: stats,
      exports: exports,
      exclusion: exclusion
    };

    return service;

    function upload(vm) {
      var uploadPath =
        "/" + vm.client.Acronym + "/" + vm.campaign.Path + "/upload";
      if ($location.path() === uploadPath) {
        $route.reload();
      }
      $location.path(uploadPath);
    }

    function download(vm) {
      $location.path(
        "/" + vm.client.Acronym + "/" + vm.campaign.Path + "/download"
      );
    }

    function lists(vm) {
      $location.path(
        "/" + vm.client.Acronym + "/" + vm.campaign.Path + "/lists"
      );
    }

    function sources(vm) {
      $location.path(
        "/" + vm.client.Acronym + "/" + vm.campaign.Path + "/sources"
      );
    }

    function headers(vm) {
      $location.path(
        "/" + vm.client.Acronym + "/" + vm.campaign.Path + "/headers"
      );
    }

    function files(vm) {
      $location.path(
        "/" + vm.client.Acronym + "/" + vm.campaign.Path + "/files"
      );
    }

    function stats(vm) {
      $location.path("/" + vm.client.Acronym + "/" + vm.campaign.Path);
    }

    function exports(vm) {
      $location.path(
        "/" + vm.client.Acronym + "/" + vm.campaign.Path + "/export"
      );
    }

    function exclusion(vm) {
      $location.path(
        "/" + vm.client.Acronym + "/" + vm.campaign.Path + "/exclusions"
      );
    }
  }
})();
