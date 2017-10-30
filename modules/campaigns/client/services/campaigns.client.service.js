(function() {
  "use strict";

  angular.module("campaigns").factory("CampaignService", CampaignService);

  CampaignService.$inject = [
    "$resource",
    "$q",
    "$routeParams",
    "GeneralFuncService"
  ];

  function CampaignService($resource, $q, $routeParams, GeneralFuncService) {
    var api = $resource(
      "/api/client/:acronym/campaigns/",
      { acronym: "@Acronym" },
      { update: { method: "PUT" } }
    );
    var deferred;

    var service = {
      getClient: getClient,
      addCampaign: addCampaign,
      updateCampaign: updateCampaign,
      getAllCampaigns: getAllCampaigns
    };

    return service;

    /*////////// Service Functions ////////////*/

    // gets the selected client object from the db
    function getClient() {
      deferred = $q.defer();

      api.get($routeParams, handleServerResponse);

      return deferred.promise;
    }

    function getAllCampaigns() {
      var resource = $resource("/api/all-campaigns/");
      deferred = $q.defer(); // create new promise

      resource.get(handleServerResponse);

      return deferred.promise;
    }

    // formats an edited campaign and posts back to the server
    function updateCampaign(campaign) {
      deferred = $q.defer(); // create new promise
      var newCampaign = new api({ Campaign: campaign }); // set req body

      api.update($routeParams, newCampaign, handleServerResponse);

      return deferred.promise;
    }

    // formats the campaign and posts it back to the server
    function addCampaign(campaign) {
      deferred = $q.defer(); // create new promise
      var newCampaign = new api({ Campaign: campaign }); // set req body

      newCampaign.$save($routeParams, handleServerResponse);

      return deferred.promise;
    }

    /*///////////////// Helper Functions /////////////////*/

    // reject or resolve the promise
    function handleServerResponse(response) {
      if (!!response.error) {
        deferred.reject(response.error);
      } else {
        deferred.resolve(response.data);
      }
    }
  }
})();
