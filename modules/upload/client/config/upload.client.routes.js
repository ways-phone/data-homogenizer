(function() {
  "use strict";

  angular.module("upload").config(UploadConfig);

  UploadConfig.$inject = ["$routeProvider"];

  function UploadConfig($routeProvider) {
    $routeProvider
      .when("/:acronym/:path/upload", {
        templateUrl: "/upload/client/views/upload-page.client.view.html",
        controllerAs: "vm",
        client_id: "@acronym",
        campaign_id: "@path"
      })
      .when("/:acronym/:path/download", {
        templateUrl: "/download/client/views/download-page.client.view.html",
        controllerAs: "vm",
        client_id: "@acronym",
        campaign_id: "@path"
      })
      .when("/:acronym/:path/lists", {
        templateUrl: "/lists/client/views/lists-page.client.view.html",
        controllerAs: "vm",
        client_id: "@acronym",
        campaign_id: "@path"
      })
      .when("/:acronym/:path/sources", {
        templateUrl: "/sources/client/views/sources-page.client.view.html",
        controllerAs: "vm",
        client_id: "@acronym",
        campaign_id: "@path"
      })
      .when("/:acronym/:path/headers", {
        templateUrl: "/header/client/views/header-page.client.view.html",
        controllerAs: "vm",
        client_id: "@acronym",
        campaign_id: "@path"
      })
      .when("/:acronym/:path/files", {
        templateUrl: "/files/client/views/files-page.client.view.html",
        controllerAs: "vm",
        client_id: "@acronym",
        campaign_id: "@path"
      })
      .when("/:acronym/:path/export", {
        templateUrl: "/export/client/views/export-page.client.view.html",
        controllerAs: "vm",
        client_id: "@acronym",
        campaign_id: "@path"
      })
      .when("/:acronym/:path/exclusions", {
        templateUrl: "/exclusion/client/views/exclusion.client.view.html",
        controllerAs: "vm",
        client_id: "@acronym",
        campaign_id: "@path"
      });
  }
})();
