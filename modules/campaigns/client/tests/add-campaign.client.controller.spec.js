"use strict";
beforeEach(module("data-uploader"));
describe("Add Campaign Controller", function() {
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
  var $uibModalInstance;
  var user;
  var CampaignService;
  var auth;
  var modalService;

  beforeEach(
    inject(function($controller, _$rootScope_, _$q_) {
      $q = _$q_;
      $scope = _$rootScope_.$new();
      $uibModalInstance = {};

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
      user = {
        Name: "Miles Johnson",
        _id: 1
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

      auth = {
        authenticate: function() {
          return true;
        },
        isLoggedIn: function() {
          return true;
        },
        currentUser: function() {
          return user;
        }
      };
      CampaignService = {
        addCampaign: function() {
          deferred = $q.defer();

          deferred.resolve({ client: client2 });
          return deferred.promise;
        }
      };
      location = {
        path: sinon.spy()
      };
      $uibModalInstance = {
        close: sinon.spy(),
        dismiss: sinon.spy()
      };

      modalService = {
        addCampaign: function() {
          deferred = $q.defer();

          deferred.resolve(client2);
          return { result: deferred.promise };
        }
      };

      controller = $controller("AddCampaignController", {
        CampaignService: CampaignService,
        authentication: auth,
        ModalService: modalService,
        $scope: $scope,
        $uibModalInstance: $uibModalInstance,
        $location: location
      });
    })
  );

  it("should set the Creator on vm.campaign on activation", function() {
    $scope.$apply();

    expect(controller.campaign).to.have.property("Creator", 1);
  });

  it("should close the $uibModalInstance when a campaign was sucessfully added", function() {
    $scope.$apply();
    controller.addCampaign();
    $scope.$apply();
    sinon.assert.calledOnce($uibModalInstance.close);
    sinon.assert.calledWith($uibModalInstance.close, { client: client2 });
  });
  it(
    "should dismiss the $uibModalInstance when a campaign was not added",
    inject(function($controller) {
      CampaignService = {
        addCampaign: function() {
          deferred = $q.defer();

          deferred.resolve();
          return deferred.promise;
        }
      };

      controller = $controller("AddCampaignController", {
        CampaignService: CampaignService,
        authentication: auth,
        ModalService: modalService,
        $scope: $scope,
        $uibModalInstance: $uibModalInstance,
        $location: location
      });
      $scope.$apply();
      controller.addCampaign();
      $scope.$apply();
      sinon.assert.calledOnce($uibModalInstance.dismiss);
      sinon.assert.calledWith($uibModalInstance.dismiss, "cancel");
    })
  );
});
