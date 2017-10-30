"use strict";
beforeEach(module("data-uploader"));
describe("Edit Campaign Controller", function() {
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
  var data;
  var campaign2;

  beforeEach(
    inject(function($controller, _$rootScope_, _$q_, _CampaignService_) {
      $q = _$q_;
      $scope = _$rootScope_.$new();
      $uibModalInstance = {};
      CampaignService = _CampaignService_;
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

      campaign2 = {
        Name: "Recycled",
        _id: 2,
        Client: client1._id,
        Path: "Recycled",
        Conversion: 3.5,
        ContactRate: 30,
        Files: [],
        Sources: []
      };

      data = {
        Campaign: campaign2
      };

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
      deferred = $q.defer();
      deferred.resolve(client1);
      var mockService = sinon.stub(CampaignService);
      mockService.updateCampaign.returns(deferred.promise);

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

      controller = $controller("EditCampaignController", {
        CampaignService: mockService,
        data: data,
        $scope: $scope,
        $uibModalInstance: $uibModalInstance,
        $location: location
      });
    })
  );

  it("should call update campaign if campaign has changed", function() {
    $scope.$apply();

    controller.campaign = campaign;
    controller.updateCampaign();
    $scope.$apply();
    sinon.assert.calledOnce(CampaignService.updateCampaign);
    sinon.assert.calledWith(CampaignService.updateCampaign, campaign);
    // sinon.assert.calledOnce( $uibModalInstance.cancel );
    // sinon.assert.calledWith( $uibModalInstance.cancel, client1 );
  });

  it("should close the modal with the updated client", function() {
    $scope.$apply();

    controller.campaign = campaign;
    controller.updateCampaign();
    $scope.$apply();

    sinon.assert.calledOnce($uibModalInstance.close);
    sinon.assert.calledWith($uibModalInstance.close, client1);
  });

  it("should dismiss the modal if campaign hasnt changed", function() {
    $scope.$apply();

    controller.updateCampaign();
    $scope.$apply();
    sinon.assert.calledOnce($uibModalInstance.dismiss);
    sinon.assert.calledWith($uibModalInstance.dismiss, "cancel");
  });
});
