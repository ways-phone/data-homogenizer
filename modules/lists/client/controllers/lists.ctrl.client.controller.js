(function() {
  "use strict";

  angular.module("list").controller("ListsCtrl", ListsCtrl);

  ListsCtrl.$inject = [
    "authentication",
    "SingleCampaignService",
    "Navigation",
    "ListService",
    "AggregateFormatter",
    "AggregateQueryCreator"
  ];

  function ListsCtrl(
    authentication,
    SingleCampaignService,
    Navigation,
    ListService,
    AggregateFormatter,
    AggregateQueryCreator
  ) {
    var vm = this;

    vm.createLists = true;
    vm.switchDisplay = switchDisplay;
    vm.createList = createList;
    vm.deleteList = deleteList;

    /////////////// Navigation ////////////////////

    vm.nav = Navigation;
    //////////////////////////////

    vm.aggregateOptions = [
      { name: "State", ticked: false },
      { name: "Gender", ticked: false },
      { name: "File", ticked: false },
      { name: "Source", ticked: true }
    ];
    vm.selectedAggregates = [];

    vm.getRecordCounts = getRecordCounts;

    vm.isObject = isObject;
    vm.isArray = isArray;
    vm.isPlainValue = isPlainValue;

    vm.sort = sort;
    activate();

    ////////////////

    function activate() {
      authentication.authenticate();
      vm.isLoading = true;
      getClientAndCampaign().then(function() {
        vm.isLoading = false;
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
    }

    function switchDisplay() {
      vm.createLists = !vm.createLists;
      if (!vm.createLists) {
        getLists();
      } else {
        vm.success = "";
        getRecordCounts();
      }
    }

    function getRecordCounts() {
      var query = createCountQuery();
      ListService.sendRecordCountRequest(query)
        .then(AggregateFormatter.format)
        .then(setViewModel)
        .catch(handleError);

      //////////////////////

      function createCountQuery() {
        vm.query = {};
        var group = {};
        vm.selectedAggregates.forEach(function(option) {
          group[option.name] = true;
        });
        vm.query.$group = group;

        return vm.query;
      }

      // sets the results of the aggregate on the server and displays them on the view
      function setViewModel(config) {
        vm.rows = config.rows;
        vm.header = config.header;
      }
    }

    function createList(row) {
      vm.isLoading = true;
      var query = AggregateQueryCreator.create(row);

      ListService.sendCreateListRequest(query)
        .then(displaySuccess)
        .catch(handleError);

      ///////////////////////////

      function displaySuccess(data) {
        vm.success = data.listName + " Created with " + data.count + " Records";
        vm.campaign = data.campaign;
        vm.rows.splice(vm.rows.indexOf(row), 1);
        vm.isLoading = false;
      }
    }

    function getLists() {
      ListService.retrieveExistingLists()
        .then(setListsOnVM)
        .then(createHeader)
        .catch(handleError);

      ////////////////////

      function setListsOnVM(lists) {
        vm.lists = lists;
      }

      function createHeader() {
        var list = vm.lists[0];
        var header = [];
        var exclude = ["__v", "_id", "Campaign", "Created", "Updated"];

        Object.keys(list).forEach(function(key) {
          if (exclude.indexOf(key) !== -1) return;
          header.push(key);
        });

        vm.header = header;
      }
    }

    function deleteList(list) {
      ListService.sendDeleteRequest(list._id)
        .then(handleSuccess)
        .catch(handleError);

      ////////////////////////

      function handleSuccess(success) {
        vm.success =
          "List successfully removed with " +
          success.nModified +
          " Records affected";
        vm.lists.splice(vm.lists.indexOf(list), 1);
      }
    }

    ///////////// Helper Functions //////////////

    function isPlainValue(key, val) {
      var exclude = ["__v", "_id", "Campaign", "Created", "Updated"];
      return !isArray(val) && !isObject(val) && exclude.indexOf(key) === -1;
    }

    function isArray(o) {
      return Object.prototype.toString.call(o) === "[object Array]";
    }

    function isObject(val) {
      if (val === null) return false;

      return Object.prototype.toString.call(val) === "[object Object]";
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
