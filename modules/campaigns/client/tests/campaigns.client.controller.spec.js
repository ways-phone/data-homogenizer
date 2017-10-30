"use strict";
beforeEach(module("data-uploader"));
describe("Campaigns Controller", function() {
  beforeEach(module("campaigns"));

  var $q;
  var $scope;
  var deferred;
  var controller;
  var client1;
  var client2;
  var campaign;
  var count;
  var location;
  beforeEach(
    inject(function($controller, _$rootScope_, _$q_) {
      $q = _$q_;
      $scope = _$rootScope_.$new();

      client1 = {
        Name: "Medicins Sans Frontieres",
        Acronym: "MSF",
        _id: 1,
        Campaigns: [campaign]
      };

      client2 = {
        Name: "Taronga",
        Acronym: "TZ",
        _id: 2
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
      count = 100;

      var auth = {
        authenticate: function() {
          return true;
        }
      };
      var EditClient = {
        getClient: function() {
          deferred = $q.defer();

          deferred.resolve({ client: client1, count: count });
          return deferred.promise;
        }
      };
      location = {
        path: sinon.spy()
      };

      var modalService = {
        createModal: function() {
          deferred = $q.defer();

          deferred.resolve(client2);
          return { result: deferred.promise };
        }
      };

      controller = $controller("ClientCtrl", {
        EditClient: EditClient,
        authentication: auth,
        ModalService: modalService,
        $scope: $scope,
        $location: location
      });
    })
  );

  it("should set vm.client on activation", function() {
    $scope.$apply();

    expect(controller.client).to.deep.equal(client1);
  });
  it("should set vm.count on activation", function() {
    $scope.$apply();

    expect(controller.count).to.equal(100);
  });
  it("should return a client after opening and closing the add campaign modal", function() {
    $scope.$apply();
    expect(controller.client).to.deep.equal(client1);
    controller.addCampaignModal();
    $scope.$apply();
    expect(controller.client).to.deep.equal(client2);
  });

  it("should return a client after opening and closing the edit campaign modal", function() {
    $scope.$apply();
    expect(controller.client).to.deep.equal(client1);
    controller.editCampaignModal();
    $scope.$apply();
    expect(controller.client).to.deep.equal(client2);
  });

  it("should set the location of the selected campaign", function() {
    $scope.$apply();
    controller.openCampaignPage(1);
    sinon.assert.calledOnce(location.path);
    sinon.assert.calledWith(location.path, "/MSF/Lead_Conversion");
  });
});
