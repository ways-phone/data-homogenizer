"use strict";
describe("Files Controller", function() {
  beforeEach(module("export"));

  var $q;
  var $scope;
  var deferred;
  var controller;
  var client1;
  var client2;
  var campaign;
  var FileService;
  var list1;
  var list2;
  var fileInfo;
  var file1;
  var file2;
  var file3;

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

      file1 = {
        Name: "Test File 1",
        _id: 1,
        Created: new Date(2017, 4, 4),
        Updated: new Date(2017, 4, 4)
      };

      file2 = {
        Name: "Test File 2",
        _id: 2,
        Created: new Date(2017, 4, 4),
        Updated: new Date(2017, 4, 4)
      };

      file3 = {
        Name: "Test File 3",
        _id: 3,
        Created: new Date(2017, 4, 4),
        Updated: new Date(2017, 4, 4)
      };

      fileInfo = {
        all: [file1, file2, file3],
        listFiles: [file3]
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

      campaign = {
        Name: "Lead Conversion",
        _id: 1,
        Client: client1._id,
        Path: "Lead_Conversion",
        Conversion: 4.5,
        ContactRate: 4.6,
        Files: [file1, file2],
        Sources: [],
        Lists: [list1, list2]
      };

      var auth = {
        authenticate: function() {
          return true;
        }
      };

      FileService = {
        retrieveAllFiles: function() {
          deferred = $q.defer();
          deferred.resolve(fileInfo);
          return deferred.promise;
        },
        deleteFile: function() {
          deferred = $q.defer();
          campaign.Files.splice(1, 1);
          deferred.resolve(campaign);
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

      controller = $controller("FilesCtrl", {
        SingleCampaignService: SingleCampaignService,
        FileService: FileService,
        authentication: auth,
        $scope: $scope,
        Navigation: nav
      });
    })
  );

  it("on init, should set vm.campaign", function() {
    $scope.$apply();

    expect(controller.campaign).to.deep.equal(campaign);
  });

  it("on init, should set vm.client", function() {
    $scope.$apply();

    expect(controller.client).to.deep.equal(client1);
  });

  it("on init, should set vm.fileInfo", function() {
    $scope.$apply();

    expect(controller.fileinfo).to.deep.equal(fileInfo);
  });

  it("on init, should set vm.files", function() {
    $scope.$apply();

    expect(controller.files).to.deep.equal(fileInfo.all);
  });

  it("on init, should mark files with lists as disabled", function() {
    $scope.$apply();

    var disabled = controller.files.filter(function(file) {
      return !!file.disabled;
    });

    expect(disabled.length).to.eq(1);

    var disabledFile = file3;
    disabledFile.disabled = true;

    expect(disabled[0]).to.deep.equal(disabledFile);
  });

  it("one delete file, should set vm.success", function() {
    $scope.$apply();
    controller.selectedFile = file1;
    controller.delete();
    $scope.$apply();
    expect(controller.success).to.eq(
      "Test File 1 Has been successfully deleted"
    );
  });

  it("on file selection, vm.selectedFile is set", function() {
    $scope.$apply();
    controller.selectFileForDeletion(file1);
    $scope.$apply();
    expect(controller.selectedFile).to.deep.eq(file1);
  });

  it("on file selection, vm.confirmDelete should be set to true", function() {
    $scope.$apply();
    controller.selectFileForDeletion(file1);
    $scope.$apply();
    expect(controller.confirmDelete).to.eq(true);
  });
  it('on file selection, vm.success should be reset to ""', function() {
    $scope.$apply();
    controller.selectFileForDeletion(file1);
    $scope.$apply();
    expect(controller.success).to.eq("");
  });

  it("on delete cancellation, vm.selectedFile should be reset to {}", function() {
    $scope.$apply();
    controller.selectFileForDeletion(file1);
    $scope.$apply();
    expect(controller.confirmDelete).to.eq(true);
    controller.cancelDeletion();
    $scope.$apply();
    expect(controller.confirmDelete).to.eq(false);
  });

  it("on delete cancellation, vm.confirmDelete should be set to false", function() {
    $scope.$apply();
    controller.selectFileForDeletion(file1);
    $scope.$apply();
    expect(controller.selectedFile).to.deep.eq(file1);
    controller.cancelDeletion();
    $scope.$apply();
    expect(controller.selectedFile).to.deep.eq({});
  });
});
