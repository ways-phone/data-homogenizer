(function() {
  "use strict";

  angular
    .module("campaign")
    .factory("SingleCampaignService", SingleCampaignService);

  SingleCampaignService.$inject = ["$routeParams", "$resource", "$q"];

  function SingleCampaignService($routeParams, $resource, $q) {
    var campaignResource = $resource("api/:acronym/:path/", {
      acronym: "@Acronym",
      path: "@Path"
    });

    var countResource = $resource("api/:acronym/:path/count/", {
      acronym: "@Acronym",
      path: "@Path"
    });

    var trackerResource = $resource("api/:acronym/:path/tracker/", {
      acronym: "@Acronym",
      path: "@Path"
    });

    var deferred;

    var service = {
      getCampaign: getCampaign,
      getRecordCount: getRecordCount,
      getSourceCountsByFile: getSourceCountsByFile
    };

    return service;

    function getCampaign(route) {
      deferred = $q.defer();

      if (!!route) $routeParams = route;

      campaignResource.get($routeParams, handleResponse);

      return deferred.promise;
    }

    function getRecordCount() {
      deferred = $q.defer();

      countResource.get($routeParams, handleResponse);

      return deferred.promise;
    }

    function getSourceCountsByFile() {
      deferred = $q.defer();

      trackerResource.get($routeParams, handleResponse);

      return deferred.promise;
    }

    function handleResponse(response) {
      if (!!response.error) return deferred.reject(response.error);
      else return deferred.resolve(response.data);
    }
  }
})();
