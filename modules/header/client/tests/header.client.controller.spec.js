"use strict";
describe("Header Controller", function() {
  beforeEach(module("export"));

  var $q;
  var $scope;
  var deferred;
  var controller;
  var client1;
  var client2;
  var campaign;
  var HeaderMapService;
  var headerConfig;
  var headerFiles;

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

      var auth = {
        authenticate: function() {
          return true;
        }
      };

      headerConfig = {
        tableData: [
          ["test", 1, "Consumer_ID"],
          [2, "Consumer_ID"],
          [3, "Consumer_ID"]
        ],
        keys: ["file", "_id", "CustKey"]
      };

      headerFiles = ["list of files"];

      HeaderMapService = {
        retrieveHeaders: function() {
          deferred = $q.defer();
          deferred.resolve();
          return deferred.promise;
        },
        formatHeaders: function() {
          deferred = $q.defer();
          deferred.resolve(headerConfig);
          return deferred.promise;
        },
        getSingleHeader: function() {
          deferred = $q.defer();
          deferred.resolve(headerFiles);
          return deferred.promise;
        },
        deleteHeader: function() {
          deferred = $q.defer();
          deferred.resolve();
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

      controller = $controller("HeaderCtrl", {
        SingleCampaignService: SingleCampaignService,
        HeaderMapService: HeaderMapService,
        authentication: auth,
        $scope: $scope,
        Navigation: nav
      });
    })
  );

  it("on init, should set vm.client", function() {
    $scope.$apply();
    expect(controller.client).to.deep.equal(client1);
  });

  it("on init, should set vm.campaign", function() {
    $scope.$apply();
    expect(controller.campaign).to.deep.equal(campaign);
  });

  it("on init, should set vm.keys", function() {
    $scope.$apply();
    expect(controller.keys).to.deep.equal(headerConfig.keys);
  });

  it("on init, should set vm.tableData", function() {
    $scope.$apply();
    expect(controller.tableData).to.deep.equal(headerConfig.tableData);
  });

  it("on select row, should set vm.row as an object version of the arrays vm.tableData and vm.keys", function() {
    $scope.$apply();
    controller.selectRow(1);
    $scope.$apply();

    expect(controller.row).to.deep.equal({
      file: "test",
      _id: 1,
      CustKey: "Consumer_ID"
    });
  });

  it("on delete header map, should set vm.success", function() {
    $scope.$apply();
    controller.selectedHeader = { _id: 1 };
    controller.deleteHeaderMap();
    $scope.$apply();
    expect(controller.success).to.eq("Header Mapping Successfully Deleted");
  });

  it("on delete header map, should set vm.delete to false", function() {
    $scope.$apply();
    controller.selectedHeader = { _id: 1 };
    controller.deleteHeaderMap();
    $scope.$apply();
    expect(controller.delete).to.eq(false);
  });

  it("on confirm delete, should set vm.delete to true", function() {
    $scope.$apply();
    controller.confirmDelete();
    expect(controller.delete).to.eq(true);
  });

  it("on cancel delete, should set vm.delete to false", function() {
    $scope.$apply();
    controller.cancelDelete();
    expect(controller.delete).to.eq(false);
  });

  it("on cancel, should clear vm.selectedHeader", function() {
    $scope.$apply();
    controller.cancel();
    expect(controller.selectedHeader).to.eq("");
  });
});
