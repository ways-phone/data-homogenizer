(function() {
  "use strict";

  angular
    .module("searchRecords")
    .controller("SearchRecordsCtrl", SearchRecordsCtrl);

  SearchRecordsCtrl.$inject = [
    "ClientService",
    "DatePicker",
    "authentication",
    "QueryRecords",
    "RecordFormatter"
  ];

  function SearchRecordsCtrl(
    ClientService,
    DatePicker,
    authentication,
    QueryRecords,
    RecordFormatter
  ) {
    /* jshint validthis:true */
    var vm = this;

    vm.today = DatePicker.today;
    vm.disableText = false;
    vm.showRecords = false;

    vm.phone = ["Phone1", "Phone2", "MobilePhone", "HomePhone"];
    vm.address = ["Address1", "Address2", "Suburb", "State", "Postcode"];
    vm.status = [
      "isDuplicate",
      "isDuplicateWithinFile",
      "isInvalid",
      "isExported"
    ];
    vm.options = ["true", "false"];

    vm.handle = handleSearchTextInput;

    vm.datepicker = DatePicker.Object();

    vm.searchRecords = searchRecord;
    vm.selectRecord = selectRecord;
    vm.showSearch = showSearch;
    vm.saveRecord = saveRecord;

    vm.sort = sort;
    activate();

    function activate() {
      authentication.authenticate();
      initQuery();
      getClients();
    }

    function getClients() {
      ClientService.receiveClients()
        .then(function(clients) {
          vm.clients = clients;
        })
        .catch(function(error) {
          console.log(error);
        });
    }

    function initQuery() {
      vm.query = {
        Range: {
          start: new Date(),
          end: new Date()
        },
        search: {}
      };
    }

    function saveRecord() {
      var update = RecordFormatter.createUpdate(vm.record);
      QueryRecords.updateRecord(vm.record._id.value, update)
        .then(handleUpdate)
        .catch(function(error) {
          console.log(error);
        });

      //////////////////////

      function handleUpdate(update) {
        var selected = vm.records.filter(function(row) {
          return row._id === update._id;
        })[0];

        vm.records[vm.records.indexOf(selected)] = update;
        selectRecord(update);
      }
    }

    function selectRecord(record) {
      vm.record = angular.copy(record);
      vm.record = RecordFormatter.format(vm.record);
    }

    function showSearch() {
      vm.showRecords = false;
      vm.records = "";
    }

    function handleSearchTextInput(field) {
      vm.errorMessage = "";
      if (field === "") {
        vm.query.search = {};
      } else {
        vm.query.search.selectedField = field;
      }

      if (vm.status.indexOf(field) !== -1) {
        vm.disableText = true;
      } else {
        vm.disableText = false;
      }
    }

    function searchRecord() {
      vm.showRecords = true;

      var query = QueryRecords.prepareSearchQuery(vm.query);

      if (!QueryRecords.isQueryValid(query, vm.disableText)) {
        vm.errorMessage = "This field cannot be blank!";
        vm.showRecords = false;
        return;
      }

      QueryRecords.searchRecords(query)
        .then(setRecordsAndResetQuery)
        .catch(function(error) {
          console.log(error);
        });

      ////////////////////////////////////

      function setRecordsAndResetQuery(records) {
        vm.records = records;
        initQuery();
      }
    }

    function sort(key) {
      vm.sortKey = key;
      if (vm.sortKey === key) {
        vm.reverse = !vm.reverse;
      }
    }
  }
})();
