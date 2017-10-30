"use strict";
describe("Upload Controller", function() {
  beforeEach(module("list"));

  var $q;
  var $scope;
  var deferred;
  var controller;
  var client1;
  var client2;
  var campaign;
  var campaign2;
  var sourcemaps;
  var sourceToAdd;
  var sourceToUpdate;
  var universalHeaders;
  var file;
  var dupeFile;
  var UploadService;
  var SourceUploadService;
  var UploadFileService;
  var HeaderService;
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

      campaign2 = {
        Name: "Changed",
        _id: 1,
        Client: client1._id,
        Path: "Changed",
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

      file = {
        name: "Test File"
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

      universalHeaders = ["a", "list", "of", "universal", "headers"];

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
      UploadFileService = {
        uploadFileToBrowser: function() {
          deferred = $q.defer();

          deferred.resolve({
            isMatch: true,
            records: ["record1"],
            header: ["header"],
            header_id: 1
          });

          return deferred.promise;
        }
      };
      UploadService = {
        getSourceMaps: function() {
          deferred = $q.defer();
          deferred.resolve(sourcemaps);
          return deferred.promise;
        },
        filenameExists: function() {
          return false;
        },
        postRecords: function() {
          deferred = $q.defer();
          deferred.resolve({
            campaign: campaign2,
            response: {
              count: 666,
              dupes: 2,
              dupesWithinFile: 1
            }
          });
          return deferred.promise;
        }
      };
      HeaderService = {
        getUniversalHeaders: function() {
          deferred = $q.defer();
          deferred.resolve(universalHeaders);
          return deferred.promise;
        },
        checkHeader: function() {
          deferred = $q.defer();
          deferred.resolve();
          return deferred.promise;
        },
        postHeaderMap: function() {
          deferred = $q.defer();
          deferred.resolve();
          return deferred.promise;
        },
        createMap: function() {
          return { map: "headerMap" };
        },
        getMapLength: function(length) {
          return length;
        },
        isMapComplete: function() {
          return true;
        }
      };
      SourceUploadService = {
        saveSourceMap: function() {
          deferred = $q.defer();
          deferred.resolve();
          return deferred.promise;
        },
        fillSources: function() {
          return false;
        },
        findExistingSources: function() {
          return [sourceToAdd];
        },
        setAllSources: function() {
          return [];
        }
      };
      var nav = {};

      controller = $controller("UploadCtrl", {
        SingleCampaignService: SingleCampaignService,
        UploadService: UploadService,
        UploadFileService: UploadFileService,
        HeaderService: HeaderService,
        SourceUploadService: SourceUploadService,
        SourceService: SourceService,
        authentication: auth,
        $scope: $scope,
        Navigation: nav
      });
    })
  );

  it("initializes vm.state", function() {
    $scope.$apply();
    expect(controller.state).to.deep.equal({
      mapping: false,
      showJSONRecords: false,
      createSourceMaps: false,
      readytoUpload: false
    });
  });

  it("initializes vm.campaign", function() {
    $scope.$apply();
    expect(controller.campaign).to.deep.equal(campaign);
  });

  it("initializes vm.client", function() {
    $scope.$apply();
    expect(controller.client).to.deep.equal(client1);
  });

  it("initialized vm.types", function() {
    $scope.$apply();
    expect(controller.types).to.deep.equal([
      "",
      "Stand Alone",
      "Grid",
      "Phone Leads"
    ]);
  });

  it("initializes univeral headers", function() {
    $scope.$apply();
    expect(controller.universalHeaders).to.deep.equal(universalHeaders);
  });

  it("initializes source maps", function() {
    $scope.$apply();
    expect(controller.maps).to.deep.equal(sourcemaps);
  });

  describe("uploading file to browser", function() {
    it("sets error message if no file selected", function() {
      $scope.$apply();
      controller.uploadFileToBrowser();
      $scope.$apply();
      expect(controller.errorMessage).to.exist;
      expect(controller.errorMessage).to.eq("No File Selected!");
    });

    it("sets the error meesage if the file already exists", function() {
      $scope.$apply();
      controller.file = file;
      UploadService.filenameExists = function() {
        return true;
      };
      controller.uploadFileToBrowser();
      $scope.$apply();
      expect(controller.errorMessage).to.exist;
      expect(controller.errorMessage).to.eq(
        "This file has already been uploaded!"
      );
    });

    it("sets vm.records, vm.header and vm.header_id if there is a header match", function() {
      $scope.$apply();
      controller.file = file;
      controller.uploadFileToBrowser(true);
      $scope.$apply();
      expect(controller.records).to.exist;
      expect(controller.records).to.deep.equal(["record1"]);
      expect(controller.header).to.exist;
      expect(controller.header).to.deep.equal(["header"]);
      expect(controller.header_id).to.exist;
      expect(controller.header_id).to.eq(1);
    });

    it("Sets the SHOW_JSON_RECORDS state if there is a header match", function() {
      $scope.$apply();
      controller.file = file;
      controller.uploadFileToBrowser(true);
      $scope.$apply();
      expect(controller.state).to.deep.equal({
        mapping: false,
        showJSONRecords: true,
        createSourceMaps: false,
        readytoUpload: false
      });
    });
    it("sets vm.originalRecords and vm.originalHeader if there is no header match", function() {
      UploadFileService.uploadFileToBrowser = function() {
        deferred = $q.defer();

        deferred.resolve({
          originalRecords: ["originalRecords"],
          originalHeader: ["originalHeader"],
          isMatch: false
        });
        return deferred.promise;
      };

      $scope.$apply();
      controller.file = file;
      controller.uploadFileToBrowser(false);
      $scope.$apply();
      expect(controller.originalRecords).to.exist;
      expect(controller.originalRecords).to.deep.equal(["originalRecords"]);
      expect(controller.originalHeader).to.exist;
      expect(controller.originalHeader).to.deep.equal(["originalHeader"]);
    });

    it("Sets the MAPPING state if there is a header match", function() {
      UploadFileService.uploadFileToBrowser = function() {
        deferred = $q.defer();

        deferred.resolve({
          originalRecords: ["originalRecords"],
          originalHeader: ["originalHeader"],
          isMatch: false
        });
        return deferred.promise;
      };
      $scope.$apply();
      controller.file = file;
      controller.uploadFileToBrowser(true);
      $scope.$apply();
      expect(controller.state).to.deep.equal({
        mapping: true,
        showJSONRecords: false,
        createSourceMaps: false,
        readytoUpload: false
      });
    });

    it("sets the state to to READY_TO_UPLOAD if all records sources are filled", function() {
      SourceUploadService.fillSources = function() {
        return true;
      };
      $scope.$apply();
      controller.file = file;
      controller.records = ["records"];
      controller.uploadFileToBrowser();
      $scope.$apply();

      expect(controller.state).to.deep.equal({
        mapping: false,
        showJSONRecords: false,
        createSourceMaps: false,
        readytoUpload: true
      });
    });
  });

  describe("posting a header map", function() {
    it("should set the error message if the header map is invalid", function() {
      $scope.$apply();
      HeaderService.getMapLength = function() {
        return 2;
      };
      controller.originalHeader = [];
      controller.postMap();
      $scope.$apply();
      expect(controller.errorMessage).to.eq(
        "You have a duplicate in your header mapping! Please check what you have selected."
      );
    });
  });

  describe("Creating Source Maps", function() {
    it("should set vm.existingSources on SetSources", function() {
      $scope.$apply();
      controller.setSources();
      $scope.$apply();

      expect(controller.existingSources).to.deep.equal([sourceToAdd]);
    });
    it("on set sources, state should be CREATE_SOURCE_MAPS", function() {
      $scope.$apply();
      controller.setSources();
      $scope.$apply();

      expect(controller.state).to.deep.equal({
        mapping: false,
        showJSONRecords: false,
        createSourceMaps: true,
        readytoUpload: false
      });
    });

    it("should set vm.canMap to true if there are existingSources", function() {
      $scope.$apply();
      controller.setSources();
      $scope.$apply();

      expect(controller.canMap).to.eq(true);
    });
  });

  describe("saving source maps", function() {});

  describe("set all sources", function() {
    it("sets a success message for all sources", function() {
      $scope.$apply();
      controller.canMap = false;
      controller.selectedSource = sourceToAdd;
      $scope.$apply();
      controller.saveSourceMap();
      $scope.$apply();

      expect(controller.success).to.eq(
        "All Sources Set to: Cohort - Stand Alone"
      );
    });
    it("sets state to READY_TO_UPLOAD", function() {
      $scope.$apply();
      controller.canMap = false;
      controller.selectedSource = sourceToAdd;
      $scope.$apply();
      controller.saveSourceMap();
      $scope.$apply();
      expect(controller.state).to.deep.equal({
        mapping: false,
        showJSONRecords: false,
        createSourceMaps: false,
        readytoUpload: true
      });
    });
  });

  describe("submitting records", function() {
    it("sets the success message after submitting", function() {
      $scope.$apply();
      controller.file = file;
      campaign.Name = "Changed";
      controller.records = ["records"];
      controller.submitRecords();
      $scope.$apply();
      expect(controller.success).to.eq(
        "Test File uploaded successfully! 666 records uploaded with 2 duplicate records and 1 Duplicates within the file."
      );
    });
    it("sets the state to NONE", function() {
      $scope.$apply();
      controller.file = file;
      campaign.Name = "Changed";
      controller.records = ["records"];
      controller.submitRecords();
      $scope.$apply();
      expect(controller.state).to.deep.equal({
        mapping: false,
        showJSONRecords: false,
        createSourceMaps: false,
        readytoUpload: false
      });
    });

    it("clears the vm.sourceMapping after successfully submitting", function() {
      $scope.$apply();
      controller.file = file;
      controller.records = ["records"];
      controller.submitRecords();
      $scope.$apply();

      expect(controller.sourceMapping.length).to.eq(0);
    });
  });
});
