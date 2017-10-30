(function() {
  "use strict";

  angular.module("search").controller("SearchController", SearchController);

  SearchController.$inject = [
    "$location",
    "authentication",
    "$window",
    "SearchService",
    "ModalService",
    "CampaignService",
    "$routeParams"
  ];

  function SearchController(
    $location,
    authentication,
    $window,
    SearchService,
    ModalService,
    CampaignService,
    $routeParams
  ) {
    var vm = this;
    vm.title = "search";
    vm.isLoading = false;
    vm.logout = logout;
    vm.openSearchModal = redirectToSearchPage;
    vm.redirectToCampaign = redirectToCampaign;
    vm.search = redirectToSearchPage;

    activate();

    function activate() {
      vm.isAuthenticated = authentication.isLoggedIn();
      if (vm.isAuthenticated) {
        getAllCampaigns();
      }
    }

    function getAllCampaigns() {
      CampaignService.getAllCampaigns().then(function(campaigns) {
        vm.campaigns = campaigns.map(function(campaign) {
          campaign.DisplayName = campaign.Client.Acronym + " " + campaign.Name;
          return campaign;
        });
      });
    }

    function redirectToCampaign() {
      $location.path("/" + vm.campaign.Client.Acronym + "/" + vm.campaign.Path);
    }

    function redirectToSearchPage() {
      console.log("before: ", $routeParams);
      $routeParams = {};
      console.log("after: ", $routeParams);
      $location.path("/search-records");
    }

    function logout() {
      authentication.logout();
    }
  }
})();
