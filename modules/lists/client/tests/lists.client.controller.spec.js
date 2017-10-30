"use strict";
describe("List Controller", function() {
  beforeEach(module("list"));

  var $q;
  var $scope;
  var deferred;
  var controller;
  var client1;
  var client2;
  var campaign;
  var lists;
  var createdList;

  var listToAdd;
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

      lists = [
        {
          _id: 1,
          Name: "Test List 1",
          Count: 200,
          Campaign: campaign,
          Created: new Date(2017, 4, 4),
          Updated: new Date(2017, 4, 4)
        },
        {
          _id: 2,
          Name: "Test List 2",
          Count: 300,
          Campaign: campaign,
          Created: new Date(2017, 4, 4),
          Updated: new Date(2017, 4, 4)
        },
        {
          _id: 3,
          Name: "Test List 3",
          Count: 100,
          Campaign: campaign,
          Created: new Date(2017, 4, 4),
          Updated: new Date(2017, 4, 4)
        }
      ];

      var auth = {
        authenticate: function() {
          return true;
        }
      };

      var AggregateFormatter = {
        format: function() {
          deferred = $q.defer();
          deferred.resolve({
            rows: ["rows", "of", "data"],
            header: "header"
          });
          return deferred.promise;
        }
      };
      var AggregateQueryCreator = {
        create: function() {
          return {};
        }
      };

      createdList = {
        listName: "Newly Created List",
        count: 2000,
        campaign: campaign
      };

      var ListService = {
        sendRecordCountRequest: function() {
          deferred = $q.defer();
          deferred.resolve();
          return deferred.promise;
        },
        sendCreateListRequest: function() {
          deferred = $q.defer();
          deferred.resolve(createdList);
          return deferred.promise;
        },
        retrieveExistingLists: function() {
          deferred = $q.defer();
          deferred.resolve(lists);
          return deferred.promise;
        },
        sendDeleteRequest: function() {
          deferred = $q.defer();
          deferred.resolve({
            nModified: 29
          });
          return deferred.promise;
        }
      };

      var SingleCampaignService = {
        getCampaign: function() {
          deferred = $q.defer();

          deferred.resolve({ client: client1, campaign: campaign });
          return deferred.promise;
        },
        getRecordCount: function() {
          deferred = $q.defer();
          deferred.resolve(client1);
          return deferred.promise;
        }
      };
      var nav = {};

      controller = $controller("ListsCtrl", {
        SingleCampaignService: SingleCampaignService,
        ListService: ListService,
        AggregateFormatter: AggregateFormatter,
        AggregateQueryCreator: AggregateQueryCreator,
        authentication: auth,
        $scope: $scope,
        Navigation: nav
      });
    })
  );

  it("initializes with vm.createLists as true ", function() {
    $scope.$apply();
    expect(controller.createLists).to.eq(true);
  });

  it("initializes with vm.aggregateOptions", function() {
    $scope.$apply();
    expect(controller.aggregateOptions).to.deep.equal([
      { name: "State", ticked: false },
      { name: "Gender", ticked: false },
      { name: "File", ticked: false },
      { name: "Source", ticked: true }
    ]);
  });

  it("initializes with vm.client ", function() {
    $scope.$apply();
    expect(controller.client).to.deep.equal(client1);
  });

  it("initializes with vm.campaign ", function() {
    $scope.$apply();
    expect(controller.campaign).to.deep.equal(campaign);
  });

  it("on switching display to view lists, vm.lists is set", function() {
    $scope.$apply();
    expect(controller.lists).to.not.exist;
    controller.switchDisplay();
    $scope.$apply();
    expect(controller.lists).to.deep.equal(lists);
  });

  it("on switching display to view lists, vm.header is set", function() {
    $scope.$apply();
    expect(controller.header).to.not.exist;
    controller.switchDisplay();
    $scope.$apply();
    expect(controller.header).to.exist;
  });

  it("on setting vm.header, nested fields Campaign, Created / Updated and _id are excluded", function() {
    $scope.$apply();
    expect(controller.header).to.not.exist;
    controller.switchDisplay();
    $scope.$apply();
    expect(controller.header).to.deep.equal(["Name", "Count"]);
  });

  it("on retrieving record counts, successfully creates a query from selected aggregates", function() {
    $scope.$apply();
    controller.selectedAggregates = [
      { name: "Gender", ticked: false },
      { name: "File", ticked: false }
    ];
    $scope.$apply();
    controller.getRecordCounts();
    $scope.$apply();

    expect(controller.query).to.deep.equal({
      $group: {
        Gender: true,
        File: true
      }
    });
  });

  it("on retrieving record counts, vm.rows and vm.header are set with the results", function() {
    $scope.$apply();
    expect(controller.rows).to.not.exist;
    controller.selectedAggregates = [
      { name: "Gender", ticked: false },
      { name: "File", ticked: false }
    ];
    $scope.$apply();
    controller.getRecordCounts();
    $scope.$apply();

    expect(controller.rows).to.exist;
    expect(controller.rows).to.deep.equal(["rows", "of", "data"]);
    expect(controller.header).to.exist;
    expect(controller.header).to.eq("header");
  });

  it("on switching display to create lists, get record counts should be called", function() {
    $scope.$apply();
    controller.switchDisplay();
    $scope.$apply();
    controller.switchDisplay();
    $scope.$apply();
    expect(controller.rows).to.exist;
    expect(controller.rows).to.deep.equal(["rows", "of", "data"]);
    expect(controller.header).to.exist;
    expect(controller.header).to.eq("header");
  });

  it("on creating a list, should set vm.success", function() {
    $scope.$apply();
    controller.rows = ["rows", "of", "data"];
    controller.createList();
    $scope.$apply();

    expect(controller.success).to.eq(
      "Newly Created List Created with 2000 Records"
    );
  });

  it("on deleting a list, should set vm.sucesss", function() {
    $scope.$apply();
    controller.lists = ["A", "List", "Of", "Lists"];
    controller.deleteList({ _id: 1 });
    $scope.$apply();
    expect(controller.success).to.eq(
      "List successfully removed with 29 Records affected"
    );
  });
});
