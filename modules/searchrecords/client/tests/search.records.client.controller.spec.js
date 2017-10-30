"use strict";
describe("Search Records Controller", function() {
  beforeEach(module("list"));

  var $q;
  var $scope;
  var deferred;
  var controller;
  var client1;
  var client2;
  var campaign;
  var QueryRecords;
  var records;
  var RecordFormatter;
  beforeEach(
    inject(function($controller, _$rootScope_, _$q_) {
      $q = _$q_;
      $scope = _$rootScope_.$new();

      client1 = {
        Name: "Medicins Sans Frontieres",
        Acronym: "MSF",
        _id: 1,
        Campaigns: [1]
      };

      client2 = {
        Name: "Taronga",
        Acronym: "TZ",
        _id: 2,
        Campaigns: ["Lead Conversion", "Recycled"]
      };

      campaign = {
        Name: "Lead Conversion",
        _id: 1,
        Client: client1._id,
        Path: "Lead_Conversion",
        Conversion: 4.5,
        ContactRate: 4.6,
        Files: [],
        Sources: [],
        Lists: []
      };

      records = [
        {
          _id: 1,
          CustKey: 1,
          FirstName: "Miles",
          LastName: "Johnson",
          MobilePhone: "483123456",
          Phone1: "61483123456"
        },
        {
          _id: 2,
          CustKey: 2,
          FirstName: "Test",
          LastName: "Testerson",
          MobilePhone: "411111111",
          Phone1: "61411111111"
        },
        {
          _id: 3,
          CustKey: 3,
          FirstName: "Lora",
          LastName: "Stockley",
          MobilePhone: "423123452",
          Phone1: "61423123452"
        }
      ];

      var auth = {
        authenticate: function() {
          return true;
        }
      };

      QueryRecords = {
        updateRecord: function() {
          deferred = $q.defer();

          deferred.resolve({
            _id: 1,
            CustKey: 1,
            FirstName: "Miles",
            LastName: "Johnson",
            MobilePhone: "483123456",
            Phone1: "61483123456",
            isUpdated: true
          });
          return deferred.promise;
        },
        prepareSearchQuery: function() {
          deferred = $q.defer();
          deferred.resolve();
          return deferred.promise;
        },
        isQueryValid: function() {
          return true;
        },
        searchRecords: function() {
          deferred = $q.defer();
          deferred.resolve([records[0], records[1]]);
          return deferred.promise;
        }
      };

      RecordFormatter = {
        createUpdate: function() {
          return {};
        },
        format: sinon.spy()
      };

      var ClientService = {
        receiveClients: function() {
          deferred = $q.defer();
          deferred.resolve([client1, client2]);
          return deferred.promise;
        }
      };

      var nav = {};

      controller = $controller("SearchRecordsCtrl", {
        ClientService: ClientService,
        RecordFormatter: RecordFormatter,
        QueryRecords: QueryRecords,
        authentication: auth,
        $scope: $scope,
        Navigation: nav
      });
    })
  );

  it("should initialize vm.phone", function() {
    $scope.$apply();
    expect(controller.phone).to.deep.equal([
      "Phone1",
      "Phone2",
      "MobilePhone",
      "HomePhone"
    ]);
  });
  it("should initialize vm.address", function() {
    $scope.$apply();
    expect(controller.address).to.deep.equal([
      "Address1",
      "Address2",
      "Suburb",
      "State",
      "Postcode"
    ]);
  });
  it("should initialize vm.status", function() {
    $scope.$apply();
    expect(controller.status).to.deep.equal([
      "isDuplicate",
      "isDuplicateWithinFile",
      "isInvalid",
      "isExported"
    ]);
  });
  it("should initialize vm.options", function() {
    $scope.$apply();
    expect(controller.options).to.deep.equal(["true", "false"]);
  });
  it("should initialize vm.disableText", function() {
    $scope.$apply();
    expect(controller.disableText).to.eq(false);
  });
  it("should initialize vm.showRecords", function() {
    $scope.$apply();
    expect(controller.showRecords).to.eq(false);
  });
  it("should initialize vm.clients", function() {
    $scope.$apply();
    expect(controller.clients).to.deep.equal([client1, client2]);
  });

  it("should initialize vm.query", function() {
    $scope.$apply();
    expect(controller.query).to.have.property("Range");
    expect(controller.query).to.have.property("search");
  });

  it("on save, should update vm.records", function() {
    $scope.$apply();
    controller.records = records;
    controller.record = records[0];
    controller.saveRecord();
    $scope.$apply();

    expect(controller.records.length).to.eq(3);
    expect(controller.records[0]).to.have.property("isUpdated", true);
  });
  it("on save, should call selectRecord and RecordFormatter.format", function() {
    $scope.$apply();
    controller.records = records;
    controller.record = records[0];
    controller.saveRecord();
    $scope.$apply();
    sinon.assert.calledOnce(RecordFormatter.format);
  });
  it("clears vm.records and sets vm.showRecords to false when showSearch() is called", function() {
    $scope.$apply();
    controller.records = records;
    controller.showRecords = true;
    $scope.$apply();

    expect(controller.showRecords).to.eq(true);
    expect(controller.records).to.deep.equal(records);

    controller.showSearch();
    $scope.$apply();

    expect(controller.showRecords).to.eq(false);
    expect(controller.records).to.eq("");
  });
  it("marks vm.query.search as blank when handling an empty search text input", function() {
    $scope.$apply();
    controller.handle("");
    $scope.$apply();
    expect(controller.query.search).to.deep.equal({});
    expect(controller.disableText).to.eq(false);
  });
  it("sets the selected field in vm.query.search for a non empty search text input", function() {
    $scope.$apply();
    controller.handle("Phone1");
    $scope.$apply();
    expect(controller.query.search).to.have.property("selectedField", "Phone1");
    expect(controller.disableText).to.eq(false);
  });
  it('sets the selected field, marks vm.disableText to true for an "is" query', function() {
    $scope.$apply();
    controller.handle("isDuplicate");
    $scope.$apply();
    expect(controller.query.search).to.have.property(
      "selectedField",
      "isDuplicate"
    );
    expect(controller.disableText).to.eq(true);
  });

  it("on valid record search sets the vm.records ", function() {
    $scope.$apply();
    controller.searchRecords();
    $scope.$apply();
    expect(controller.records.length).to.equal(2);
    expect(controller.records).to.deep.equal([records[0], records[1]]);
    expect(controller.showRecords).to.eq(true);
  });

  it("on valid record search reinitialized the query", function() {
    $scope.$apply();
    controller.searchRecords();
    $scope.$apply();
    expect(controller.query).to.have.property("Range");
    expect(controller.query).to.have.property("search");
    expect(controller.query.search).to.deep.equal({});
    expect(controller.showRecords).to.eq(true);
  });

  it("on invalid record search, sets the vm.errorMessage", function() {
    QueryRecords.isQueryValid = function() {
      return false;
    };
    $scope.$apply();
    controller.searchRecords();
    $scope.$apply();
    expect(controller.errorMessage).to.eq("This field cannot be blank!");
  });

  it("on invalid record search, sets vm.showRecords to false", function() {
    QueryRecords.isQueryValid = function() {
      return false;
    };
    $scope.$apply();
    controller.searchRecords();
    $scope.$apply();
    expect(controller.showRecords).to.eq(false);
  });
});
