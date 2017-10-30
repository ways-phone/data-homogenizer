(function() {
  "use strict";

  angular.module("sources").controller("SourcesCtrl", SourcesCtrl);

  SourcesCtrl.$inject = [
    "SingleCampaignService",
    "Navigation",
    "authentication",
    "DateFormat",
    "SourceService",
    "ErrorHandler",
    "DatePicker",
    "SourcemapService"
  ];

  function SourcesCtrl(
    SingleCampaignService,
    Navigation,
    authentication,
    DateFormat,
    SourceService,
    ErrorHandler,
    DatePicker,
    SourcemapService
  ) {
    var vm = this;

    /////////////// Navigation ////////////////////

    vm.nav = Navigation;

    //////////////////////////////

    // source types
    vm.types = ["", "Stand Alone", "Grid", "Phone Leads"];

    // display state
    vm.state = {
      editing: false,
      list: true,
      creating: false,
      overwrite: false,
      sourcemaps: false
    };

    vm.datepicker = DatePicker.Object();
    //datepicker methods
    vm.today = DatePicker.today;

    vm.start = new Date();
    vm.end = new Date();

    // create new source
    vm.addSource = addSource;
    // editing existing sources
    vm.editSource = editSource;
    // overwriting costs
    vm.overwriteCost = overwriteCost;
    // source maps
    vm.displayMaps = displayMaps;
    vm.deleteMap = deleteMap;

    // display options
    vm.setState = setState;
    vm.showEdit = showEdit;
    vm.showOverwrite = showOverwrite;
    vm.sort = sort;
    activate();

    ////////////////

    function activate() {
      authentication.authenticate();
      vm.isLoading = true;
      getClientAndCampaign()
        .then(loadSourceMaps)
        .then(function() {
          vm.isLoading = false;
          vm.campaign.Sources.sort(function(a, b) {
            return a.DisplayName.localeCompare(b.Name);
          });
          setTimestamp();
        });

      ///////////////////////////

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

      function loadSourceMaps() {
        SourcemapService.loadSourceMaps()
          .then(function(data) {
            vm.sourcemaps = data;
            createSources();
          })
          .catch(function(error) {
            console.log(error);
          });
      }

      function setTimestamp() {
        vm.campaign.Sources = vm.campaign.Sources.map(DateFormat.setTimestamp);
      }
    }

    function addSource(sourceForm) {
      vm.source.Campaign = vm.campaign._id;
      if (sourceForm.$valid) {
        SourceService.postSource(vm.source)
          .then(setSourceOnVM)
          .catch(handleError);
      }
      sourceForm.$setPristine();

      ///////////////////

      function setSourceOnVM(data) {
        vm.source = {};

        vm.campaign.Sources.push(DateFormat.setTimestamp(data.source));
        vm.setState("list");
        vm.success = "Source Created Successfully!";
      }
    }

    function editSource(form) {
      if (form.$valid) {
        SourceService.editSource(vm.source)
          .then(setNewSource)
          .catch(function(err) {
            vm.error = ErrorHandler.handleError(err, vm.Name);
          });
      }

      //////////////////////

      function setNewSource(source) {
        var toUpdate = vm.campaign.Sources.filter(function(s) {
          return s._id === source._id;
        })[0];

        var index = vm.campaign.Sources.indexOf(toUpdate);

        vm.campaign.Sources[index] = source;
        vm.source = {};
        setState("list");
        vm.success = "Source Updated Correctly!";
      }
    }

    function overwriteCost() {
      vm.showResult = true;
      SourceService.overwriteCost(vm.source, vm.start, vm.end)
        .then(function(data) {
          setState("list");
          vm.success = data.nModified + " Records updated successfully";
        })
        .catch(function(error) {
          vm.error = "Something happened to my head: " + error;
        });
    }

    function displayMaps() {
      vm.maps = vm.sourcemaps.filter(function(map) {
        return map.Source._id === vm.source._id;
      });
    }

    function deleteMap(id) {
      SourcemapService.deleteSourceMap(id)
        .then(function(removed) {
          vm.success = "Source map deleted successfully!";
          vm.sourcemaps = vm.sourcemaps.filter(function(map) {
            return map._id !== removed._id;
          });
          vm.maps = {};
          createSources();
          displayMaps();
        })
        .catch(function(error) {
          console.log(error);
        });
    }

    function createSources() {
      vm.sources = [];
      vm.sourcemaps.forEach(function(map) {
        var existing = vm.sources.filter(function(source) {
          return source._id === map.Source._id;
        });
        if (existing.length === 0) {
          vm.sources.push(map.Source);
        }
      });
    }

    function setState(state) {
      vm.success = "";
      vm.error = "";
      Object.keys(vm.state).forEach(setKeyAsTrue);
      ///////////

      function setKeyAsTrue(key) {
        if (key === state) {
          vm.state[key] = true;
        } else {
          vm.state[key] = false;
        }
      }
    }

    function showEdit(source) {
      vm.source = source;
      setState("editing");
    }

    function showOverwrite(source) {
      vm.source = source;
      setState("overwrite");
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
