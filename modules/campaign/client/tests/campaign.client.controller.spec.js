"use strict";
describe("Campaign Controller", function() {
  beforeEach(module("campaign"));

  var $q;
  var $scope;
  var deferred;
  var controller;
  var client1;
  var client2;
  var campaign;
  var counts;
  var location;
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
        Sources: []
      };

      var sourceCounts = [
        [
          {
            created: new Date(2017, 3, 3),
            source: "8th Floor - Stand Alone",
            count: 100
          }
        ]
      ];

      var auth = {
        authenticate: function() {
          return true;
        }
      };

      counts = {
        Total: 10,
        callable: 8
      };

      var RecordCountService = {
        createCounts: function() {
          return counts;
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
        },
        getSourceCountsByFile: function() {
          deferred = $q.defer();

          deferred.resolve(sourceCounts);
          return deferred.promise;
        }
      };
      var nav = {};

      controller = $controller("CampaignController", {
        SingleCampaignService: SingleCampaignService,
        RecordCountService: RecordCountService,
        authentication: auth,
        $scope: $scope,
        Navigation: nav
      });
    })
  );

  it("should set vm.campaign on activation", function() {
    $scope.$apply();

    expect(controller.campaign).to.equal(campaign);
  });

  it("should set vm.client on activation", function() {
    $scope.$apply();

    expect(controller.client).to.equal(client1);
  });

  it("should set vm.count on activation", function() {
    $scope.$apply();

    expect(controller.count).to.equal(counts);
  });

  it("should set vm.trackerTable on activation", function() {
    $scope.$apply();

    expect(controller.trackerTable[0]).to.have.property(
      "created",
      "03/04/2017 00:00"
    );
    expect(controller.trackerTable[0]).to.have.property(
      "source",
      "8th Floor - Stand Alone"
    );
    expect(controller.trackerTable[0]).to.have.property("count", 100);
  });
});
