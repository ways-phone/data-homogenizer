"use strict";
describe("Source Controller", function() {
  beforeEach(module("list"));

  var $q;
  var $scope;
  var deferred;
  var controller;
  var client1;
  var client2;
  var campaign;
  var sourcemaps;
  var sourceToAdd;
  var sourceToUpdate;
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
        Sources: [
          {
            _id: 1,
            DisplayName: "8th Floor - Stand Alone",
            Created: new Date(2017, 3, 3),
            Updated: new Date(2017, 3, 3)
          },
          {
            _id: 2,
            DisplayName: "Offers Now - Stand Alone",
            Created: new Date(2017, 3, 3),
            Updated: new Date(2017, 3, 3)
          }
        ],
        Lists: []
      };

      sourceToUpdate = {
        _id: 1,
        DisplayName: "8th Floor - Stand Alone",
        Created: new Date(2017, 3, 3),
        Updated: new Date(2017, 3, 3),
        Cost: 2.5
      };

      var auth = {
        authenticate: function() {
          return true;
        }
      };
      sourcemaps = [
        {
          _id: 1,
          Source: {
            _id: 1,
            DisplayName: "8th Floor - Stand Alone"
          },
          Name: "8th Floor"
        },
        {
          _id: 2,
          Source: {
            _id: 1,
            DisplayName: "8th Floor - Stand Alone"
          },
          Name: "8thFloor"
        },
        {
          _id: 3,
          Source: {
            _id: 2,
            DisplayName: "Offers Now - Stand Alone"
          },
          Name: "offersnow"
        }
      ];

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
      sourceToAdd = {
        _id: 4,
        DisplayName: "Cohort - Stand Alone",
        Name: "Cohort",
        Type: "Stand Alone",
        Created: new Date(2017, 3, 3),
        Updated: new Date(2017, 3, 3)
      };

      var SourceService = {
        postSource: function() {
          deferred = $q.defer();
          deferred.resolve({
            source: sourceToAdd
          });
          return deferred.promise;
        },
        editSource: function() {
          deferred = $q.defer();
          deferred.resolve(sourceToUpdate);
          return deferred.promise;
        },
        overwriteCost: function() {
          deferred = $q.defer();
          deferred.resolve({
            nModified: 40
          });
          return deferred.promise;
        }
      };
      var SourcemapService = {
        loadSourceMaps: function() {
          deferred = $q.defer();
          deferred.resolve(sourcemaps);
          return deferred.promise;
        },
        deleteSourceMap: function() {
          deferred = $q.defer();
          deferred.resolve(sourcemaps[0]);
          return deferred.promise;
        }
      };

      var nav = {};

      controller = $controller("SourcesCtrl", {
        SingleCampaignService: SingleCampaignService,
        SourceService: SourceService,
        SourcemapService: SourcemapService,
        authentication: auth,
        $scope: $scope,
        Navigation: nav
      });
    })
  );

  it("initializes vm.types", function() {
    $scope.$apply();
    expect(controller.types).to.deep.equal([
      "",
      "Stand Alone",
      "Grid",
      "Phone Leads"
    ]);
  });
  it("initializes vm.state", function() {
    $scope.$apply();
    expect(controller.state).to.deep.equal({
      editing: false,
      list: true,
      creating: false,
      overwrite: false,
      sourcemaps: false
    });
  });
  it("initializes vm.sourcemaps", function() {
    $scope.$apply();
    expect(controller.sourcemaps).to.deep.equal(sourcemaps);
  });
  it("initializes datapicker", function() {
    $scope.$apply();

    expect(controller.datepicker).to.exist;
  });
  it("initializes vm.today, vm.start and vm.end", function() {
    $scope.$apply();

    expect(controller.start).to.exist;
    expect(controller.end).to.exist;
    expect(controller.today).to.exist;
  });
  it("initialized vm.sources from sourcemaps without creating dupes", function() {
    $scope.$apply();

    expect(controller.sources.length).to.eq(2);
    expect(controller.sources[0]).to.deep.equal(sourcemaps[0].Source);
  });
  it("initializes vm.campaign", function() {
    $scope.$apply();

    expect(controller.campaign).to.deep.equal(campaign);
  });
  it("initialized vm.client", function() {
    $scope.$apply();

    expect(controller.client).to.deep.equal(client1);
  });
  it("formats campaign source dates on init", function() {
    $scope.$apply();

    expect(controller.campaign.Sources[0].timestamp.created).to.eq(
      "03/04/2017 00:00"
    );
    expect(controller.campaign.Sources[0].timestamp.updated).to.eq(
      "03/04/2017 00:00"
    );
  });
  it("on source creation, adds the new source to the campaign sources and sets the timestamp", function() {
    var sourceForm = {
      $valid: true,
      $setPristine: function() {}
    };
    $scope.$apply();
    controller.source = {};
    controller.addSource(sourceForm);
    $scope.$apply();
    expect(controller.campaign.Sources.length).to.eq(3);
    expect(controller.campaign.Sources[2]).to.have.property(
      "DisplayName",
      "Cohort - Stand Alone"
    );
    expect(controller.campaign.Sources[2].timestamp.created).to.eq(
      "03/04/2017 00:00"
    );
    expect(controller.campaign.Sources[2].timestamp.updated).to.eq(
      "03/04/2017 00:00"
    );
  });
  it("on source creation, sets the success message", function() {
    var sourceForm = {
      $valid: true,
      $setPristine: function() {}
    };
    $scope.$apply();
    controller.source = {};
    controller.addSource(sourceForm);
    $scope.$apply();
    expect(controller.success).to.eq("Source Created Successfully!");
  });
  it("on source creation, sets the state to list", function() {
    var sourceForm = {
      $valid: true,
      $setPristine: function() {}
    };
    $scope.$apply();
    controller.source = {};
    controller.addSource(sourceForm);
    $scope.$apply();
    expect(controller.state).to.deep.equal({
      editing: false,
      list: true,
      creating: false,
      overwrite: false,
      sourcemaps: false
    });
  });
  it("on source edit, vm.campaign.Sources is updated", function() {
    var sourceForm = {
      $valid: true,
      $setPristine: function() {}
    };
    $scope.$apply();
    controller.source = {};
    controller.editSource(sourceForm);
    $scope.$apply();

    expect(controller.campaign.Sources.length).to.eq(2);
    expect(controller.campaign.Sources[1]).to.have.property("Cost", 2.5);
  });
  it("on source edit, vm.success is set", function() {
    var sourceForm = {
      $valid: true,
      $setPristine: function() {}
    };
    $scope.$apply();
    controller.source = {};
    controller.editSource(sourceForm);
    $scope.$apply();

    expect(controller.success).to.eq("Source Updated Correctly!");
  });

  it("on source edit, sets the state to list", function() {
    var sourceForm = {
      $valid: true,
      $setPristine: function() {}
    };
    $scope.$apply();
    controller.source = {};
    controller.editSource(sourceForm);
    $scope.$apply();
    expect(controller.state).to.deep.equal({
      editing: false,
      list: true,
      creating: false,
      overwrite: false,
      sourcemaps: false
    });
  });
  it("on overwrite cost, sets the sucess message", function() {
    $scope.$apply();
    controller.source = {};
    controller.overwriteCost();
    $scope.$apply();

    expect(controller.success).to.eq("40 Records updated successfully");
  });
  it("on display maps, returns sourcemaps associated with vm.source", function() {
    $scope.$apply();
    controller.source = { _id: 1 };
    controller.displayMaps();
    $scope.$apply();

    expect(controller.maps.length).to.eq(2);
    expect(controller.maps[0].Name).to.eq("8th Floor");
    expect(controller.maps[1].Name).to.eq("8thFloor");

    $scope.$apply();
    controller.source = { _id: 2 };
    controller.displayMaps();
    $scope.$apply();

    expect(controller.maps.length).to.eq(1);
    expect(controller.maps[0].Name).to.eq("offersnow");
  });

  it("on sourcemap delete, should set the success message", function() {
    $scope.$apply();
    controller.source = {
      _id: 1,
      DisplayName: "8th Floor - Stand Alone",
      Created: new Date(2017, 3, 3),
      Updated: new Date(2017, 3, 3)
    };
    controller.deleteMap();
    $scope.$apply();
    expect(controller.success).to.eq("Source map deleted successfully!");
  });

  it("on sourcemap delete, should remove the sourcemap from vm.sourcemaps", function() {
    controller.source = {
      _id: 1,
      DisplayName: "8th Floor - Stand Alone",
      Created: new Date(2017, 3, 3),
      Updated: new Date(2017, 3, 3)
    };
    $scope.$apply();

    controller.deleteMap();

    $scope.$apply();
    expect(controller.sourcemaps.length).to.eq(2);
    expect(controller.sources.length).to.eq(2);
    expect(controller.maps.length).to.eq(1);
  });

  it("set state handles correct state", function() {
    $scope.$apply();
    controller.setState("editing");
    expect(controller.state).to.deep.equal({
      editing: true,
      list: false,
      creating: false,
      overwrite: false,
      sourcemaps: false
    });
    controller.setState("creating");
    expect(controller.state).to.deep.equal({
      editing: false,
      list: false,
      creating: true,
      overwrite: false,
      sourcemaps: false
    });
    controller.setState("overwrite");
    expect(controller.state).to.deep.equal({
      editing: false,
      list: false,
      creating: false,
      overwrite: true,
      sourcemaps: false
    });
    controller.setState("sourcemaps");
    expect(controller.state).to.deep.equal({
      editing: false,
      list: false,
      creating: false,
      overwrite: false,
      sourcemaps: true
    });
  });
  it("set state sets all states as fault if a non existent state is called", function() {
    $scope.$apply();
    controller.setState("asdasd");

    expect(controller.state).to.deep.equal({
      editing: false,
      list: false,
      creating: false,
      overwrite: false,
      sourcemaps: false
    });
  });
});
