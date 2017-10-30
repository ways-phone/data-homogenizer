"use strict";
describe("Download Controller", function() {
  beforeEach(module("download"));

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
  var DownloadService;
  var DownloadFileService;
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
        Files: [
          {
            Created: new Date(2017, 4, 3),
            Updated: new Date(2017, 4, 3)
          }
        ],
        Sources: []
      };

      var auth = {
        authenticate: function() {
          return true;
        }
      };

      DownloadService = {
        prepareDownload: sinon.spy(),
        retrieveRecords: function() {
          var deferred = $q.defer();
          deferred.resolve(["records"]);
          return deferred.promise;
        }
      };

      DownloadFileService = {
        prepareFileForDownload: function() {
          return {
            headers: ["headers"],
            filename: "test file"
          };
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

      controller = $controller("DownloadCtrl", {
        SingleCampaignService: SingleCampaignService,
        DownloadFileService: DownloadFileService,
        DownloadService: DownloadService,
        authentication: auth,
        $scope: $scope,
        Navigation: nav
      });
    })
  );

  it("should initialise vm.downloadType", function() {
    var expected = {
      byCampaign: false,
      byFile: false,
      byList: false,
      bySource: false
    };
    $scope.$apply();
    expect(controller.downloadType).to.deep.equal(expected);
  });

  it("should initialise vm.downloadTypes", function() {
    var expected = ["File", "List", "Source", "Campaign"];
    $scope.$apply();
    expect(controller.downloadOptions).to.deep.equal(expected);
  });

  it("should initialise vm.recordStates", function() {
    var expected = ["Clean", "All"];
    $scope.$apply();
    expect(controller.recordStates).to.deep.equal(expected);
  });

  it("should initialise vm.selectedRecordState", function() {
    var expected = "Clean";
    $scope.$apply();
    expect(controller.selectedRecordState).to.deep.equal(expected);
  });

  it("should initialise vm.datepicker", function() {
    var expected = ["File", "List", "Source", "Campaign"];
    $scope.$apply();
    expect(controller.datepicker).to.have.property("today");
    expect(controller.datepicker).to.have.property("popup1");
    expect(controller.datepicker).to.have.property("popup2");
    expect(controller.datepicker).to.have.property("date");
    expect(controller.datepicker).to.have.property("open");
  });

  it("should initialise vm.campaign", function() {
    $scope.$apply();
    expect(controller.campaign).to.deep.equal(campaign);
  });

  it("should initialise vm.client", function() {
    $scope.$apply();
    expect(controller.client).to.deep.equal(client1);
  });

  it("should format file timestamps", function() {
    $scope.$apply();
    expect(controller.campaign.Files[0].Created).to.equal("03/05/2017 00:00");
    expect(controller.campaign.Files[0].Updated).to.equal("03/05/2017 00:00");
  });

  it("should correctly set downloadType based on the selectedType", function() {
    var byFile = {
      byCampaign: false,
      byFile: true,
      byList: false,
      bySource: false
    };
    var byCampaign = {
      byCampaign: true,
      byFile: false,
      byList: false,
      bySource: false
    };
    var byList = {
      byCampaign: false,
      byFile: false,
      byList: true,
      bySource: false
    };
    var bySource = {
      byCampaign: false,
      byFile: false,
      byList: false,
      bySource: true
    };
    $scope.$apply();
    controller.selectedType = "File";
    controller.showDownloadOptions();
    $scope.$apply();
    expect(controller.downloadType).to.deep.equal(byFile);
    controller.selectedType = "Source";
    controller.showDownloadOptions();
    $scope.$apply();
    expect(controller.downloadType).to.deep.equal(bySource);
    controller.selectedType = "Campaign";
    controller.showDownloadOptions();
    $scope.$apply();
    expect(controller.downloadType).to.deep.equal(byCampaign);
    controller.selectedType = "List";
    controller.showDownloadOptions();
    $scope.$apply();
    expect(controller.downloadType).to.deep.equal(byList);
  });

  it("on download passes the correct parameters to prepare the download", function() {
    $scope.$apply();
    controller.download({ Campaign: campaign._id });
    $scope.$apply();
    sinon.assert.calledOnce(DownloadService.prepareDownload);
    expect(DownloadService.prepareDownload.args[0].length).to.equal(4);
    expect(DownloadService.prepareDownload.args[0][0]).to.deep.equal({
      Campaign: 1
    });
    expect(DownloadService.prepareDownload.args[0][1]).to.have.property(
      "campaign",
      campaign
    );
    expect(DownloadService.prepareDownload.args[0][1]).to.have.property(
      "client",
      client1
    );
    expect(DownloadService.prepareDownload.args[0][1]).to.have.property(
      "start"
    );
    expect(DownloadService.prepareDownload.args[0][1]).to.have.property("end");
    expect(DownloadService.prepareDownload.args[0][1]).to.have.property(
      "downloadType"
    );

    expect(DownloadService.prepareDownload.args[0][2]).to.deep.equal({
      byCampaign: false,
      byFile: false,
      byList: false,
      bySource: false
    });

    expect(DownloadService.prepareDownload.args[0][3]).to.deep.equal("Clean");

    // expect( DownloadService.prepareDownload.args[ 0 ][ 1 ] ).to.deep.equal( {
    //     campaign: campaign,
    //     client: client1,
    //     start: new Date(),
    //     end: new Date(),
    //     downloadType: {
    //         byCampaign: false,
    //         byFile: false,
    //         byList: false,
    //         bySource: false
    //     }
    // } );
  });

  it("on download should call the prepareFileDownload method and set vm.headers and vm.filename", function() {
    $scope.$apply();
    controller.download({ Campaign: campaign._id });
    $scope.$apply();
    expect(controller.headers).to.deep.equal(["headers"]);
    expect(controller.filename).to.equal("test file");
  });
});
