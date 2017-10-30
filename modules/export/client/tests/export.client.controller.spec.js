"use strict";
describe("Export Controller", function() {
  beforeEach(module("export"));

  var $q;
  var $scope;
  var deferred;
  var controller;
  var client1;
  var client2;
  var campaign;
  var counts;
  var location;
  var $uibModalInstance;
  var DatasetNameService;
  var ExportService;
  var list1;
  var list2;
  var exportedList;
  var dataset;
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

      list1 = {
        Name: "Test List 1",
        _id: 1,
        Created: new Date(2017, 4, 4),
        Updated: new Date(2017, 4, 4),
        Count: 10
      };
      list2 = {
        Name: "Test List 2",
        _id: 2,
        Created: new Date(2017, 4, 4),
        Updated: new Date(2017, 4, 4),
        Count: 20
      };
      exportedList = {
        Name: "exported list",
        _id: 3,
        Created: new Date(2017, 4, 4),
        Updated: new Date(2017, 4, 4),
        isExported: true
      };

      listToAdd = {
        Name: "add list",
        _id: 4,
        Created: new Date(2017, 4, 4),
        Updated: new Date(2017, 4, 4),
        isExported: false,
        Count: 40
      };
      dataset = {
        Name: "Test Dataset 1",
        _id: 1,
        List: [list1]
      };

      campaign = {
        Name: "Lead Conversion",
        _id: 1,
        Client: client1._id,
        Path: "Lead_Conversion",
        Conversion: 4.5,
        ContactRate: 4.6,
        Files: [
          {
            Created: new Date(2017, 4, 3),
            Updated: new Date(2017, 4, 3)
          }
        ],
        Sources: [],
        Lists: [list1, list2, exportedList]
      };

      var auth = {
        authenticate: function() {
          return true;
        }
      };

      DatasetNameService = {
        createName: sinon.spy()
      };

      ExportService = {
        createDataset: function() {
          deferred = $q.defer();
          deferred.resolve({ dataset: dataset });
          return deferred.promise;
        },
        retrieveDatasets: function() {
          deferred = $q.defer();
          deferred.resolve([dataset]);
          return deferred.promise;
        },
        addListToDataset: function() {
          deferred = $q.defer();
          deferred.resolve([dataset]);
          return deferred.promise;
        },
        deleteDataset: function() {
          deferred = $q.defer();
          deferred.resolve(dataset);
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
      $uibModalInstance = {
        close: sinon.spy(),
        dismiss: sinon.spy()
      };

      controller = $controller("ExportCtrl", {
        SingleCampaignService: SingleCampaignService,
        DatasetNameService: DatasetNameService,
        ExportService: ExportService,
        authentication: auth,
        $scope: $scope,
        Navigation: nav
      });
    })
  );

  it("should initialize vm.state", function() {
    $scope.$apply();

    expect(controller.state).to.deep.equal({
      create: true,
      add: false,
      push: false,
      showLists: false
    });
  });

  it("should initialize vm.selectedClass", function() {
    $scope.$apply();

    expect(controller.selectedClass).to.eq("selected");
  });

  it("should initialize vm.campaign", function() {
    $scope.$apply();

    expect(controller.campaign).to.deep.equal(campaign);
  });

  it("should initialize vm.client", function() {
    $scope.$apply();

    expect(controller.client).to.deep.equal(client1);
  });

  it("should format lists timestamps on activation", function() {
    $scope.$apply();

    expect(controller.campaign.Lists[0].timestamp.created).to.eq(
      "04/05/2017 00:00"
    );
    expect(controller.campaign.Lists[0].timestamp.updated).to.eq(
      "04/05/2017 00:00"
    );
  });

  it("should remove exported list from vm.campin on activation", function() {
    $scope.$apply();

    expect(controller.campaign.Lists.length).to.eq(2);
  });

  it("should initialize vm.datasets", function() {
    $scope.$apply();

    expect(controller.datasets).to.exist;
    expect(controller.datasets).to.deep.equal([dataset]);
  });

  it("should initialize vm.datasets with the correct record count", function() {
    $scope.$apply();

    expect(controller.datasets[0].count).to.eq(10);
  });

  it("should successfully add a list to vm.selectedLists", function() {
    $scope.$apply();
    controller.setSelectedList(listToAdd, true);

    $scope.$apply();

    expect(controller.selectedLists[0]).to.deep.equal(listToAdd);
  });

  it("should call the dataset name service create name function with the correct args", function() {
    $scope.$apply();
    controller.setSelectedList(listToAdd, true);

    $scope.$apply();

    sinon.assert.calledOnce(DatasetNameService.createName);
    sinon.assert.calledWith(
      DatasetNameService.createName,
      [listToAdd],
      listToAdd.Name
    );
  });

  it("should successfully remove a list from vm.selectedLists", function() {
    $scope.$apply();
    controller.setSelectedList(listToAdd, true);

    $scope.$apply();

    controller.setSelectedList(listToAdd, false);

    $scope.$apply();

    expect(controller.selectedLists).to.deep.equal([]);
  });

  it("on creating a dataset it should set the success message", function() {
    $scope.$apply();
    controller.list = list1;
    controller.createDataset();
    $scope.$apply();

    expect(controller.success).to.eq("Test Dataset 1 Created successfully");
  });

  it("on creating a dataset it clear vm.selectedLists and vm.customListName", function() {
    $scope.$apply();
    controller.list = list1;
    controller.createDataset();
    $scope.$apply();

    expect(controller.customListName).to.eq("");
    expect(controller.selectedLists).to.deep.equal([]);
  });

  it("on adding a list to a dataset should set the correct count and list name on the success message", function() {
    $scope.$apply();
    controller.setSelectedList(listToAdd, true);

    $scope.$apply();
    controller.dataset = dataset;
    controller.addListTodataset();

    $scope.$apply();

    expect(controller.success).to.eq(
      "40 Records Added to Dataset: Test Dataset 1"
    );
  });

  it("on adding a list to the dataset should clear vm.dataset and set the state to add", function() {
    $scope.$apply();
    controller.setSelectedList(listToAdd, true);

    $scope.$apply();
    controller.dataset = dataset;
    controller.addListTodataset();

    $scope.$apply();

    expect(controller.state).to.deep.equal({
      create: false,
      add: true,
      push: false,
      showLists: false
    });
    expect(controller.dataset).to.eq("");
  });

  it("on dataset deletion, should set the success message with the correct name", function() {
    $scope.$apply();
    controller.deleteDataset(dataset);
    $scope.$apply();
    expect(controller.success).to.eq(
      "Dataset Test Dataset 1 was successfully deleted"
    );
  });

  it("should be able to set vm.state correctly based on the string parameter", function() {
    $scope.$apply();
    controller.setState("create", dataset);
    $scope.$apply();
    expect(controller.state).to.deep.equal({
      create: true,
      add: false,
      push: false,
      showLists: false
    });

    controller.setState("add", dataset);
    $scope.$apply();
    expect(controller.state).to.deep.equal({
      create: false,
      add: true,
      push: false,
      showLists: false
    });

    controller.setState("push", dataset);
    $scope.$apply();
    expect(controller.state).to.deep.equal({
      create: false,
      add: false,
      push: true,
      showLists: false
    });

    controller.setState("showLists", dataset);
    $scope.$apply();
    expect(controller.state).to.deep.equal({
      create: false,
      add: false,
      push: false,
      showLists: true
    });
  });
});
