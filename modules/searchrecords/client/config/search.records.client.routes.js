(function() {
  "use strict";

  angular.module("searchRecords").config(SearchRecordsConfig);

  SearchRecordsConfig.$inject = ["$routeProvider"];

  function SearchRecordsConfig($routeProvider) {
    $routeProvider.when("/search-records/", {
      templateUrl:
        "/searchrecords/client/views/search.records.client.view.html",
      controllerAs: "vm"
    });
  }
})();
