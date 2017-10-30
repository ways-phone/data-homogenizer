"use strict";
describe("Download Service", function() {
  beforeEach(module("download"));

  var $q;
  var $scope;
  var deferred;
  var controller;
  var client1;
  var client2;
  var campaign;
  var file;
  var location;
  var $uibModalInstance;
  var config;
  var downloadService;
  var expectedRecordState;

  beforeEach(
    inject(function(DownloadService) {
      downloadService = DownloadService;

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
      file = {
        Name: "test file",
        Created: new Date(),
        _id: 1
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

      config = {
        campaign: campaign,
        client: client1,
        start: new Date(),
        end: new Date(),
        downloadType: {
          byCampaign: true,
          byFile: false,
          byList: false,
          bySource: false
        }
      };

      expectedRecordState = {
        isDuplicate: true,
        isDuplicateWithinFile: true,
        isInvalid: true
      };
    })
  );

  it("on clean campaign download sets query.Created.$gte/$lte, and isInvalid to false", function() {
    var query = { Campaign: 1 };
    var downloadType = {
      byCampaign: true,
      byFile: false,
      byList: false,
      bySource: false
    };
    var selectedRecordState = "Clean";
    var prep = downloadService.prepareDownload(
      query,
      config,
      downloadType,
      selectedRecordState
    );
    expect(prep.query.Created).to.have.property("$gte");
    expect(prep.query.Created).to.have.property("$lt");
    expect(prep.query).to.have.property("isInvalid", false);

    //
  });

  it("on all campaign download sets query.Created.$gte/$lte, query.$or.isDuplicate/WithinFile, config.recordStates", function() {
    var query = { Campaign: 1 };
    var downloadType = {
      byCampaign: true,
      byFile: false,
      byList: false,
      bySource: false
    };
    var selectedRecordState = "all";
    var prep = downloadService.prepareDownload(
      query,
      config,
      downloadType,
      selectedRecordState
    );

    expect(prep.query.Created).to.have.property("$gte");
    expect(prep.query.Created).to.have.property("$lt");
    expect(prep.query.isInvalid).to.not.exist;
    expect(prep.query.$or).to.have.property("isDuplicate", true);
    expect(prep.query.$or).to.have.property("isDuplicateWithinFile", true);
    expect(prep.config.recordStates).to.deep.equal(expectedRecordState);

    //
  });

  it("on clean file download sets config.file and isInvalid to false", function() {
    var query = file;
    var downloadType = {
      byCampaign: false,
      byFile: true,
      byList: false,
      bySource: false
    };
    var selectedRecordState = "Clean";
    var prep = downloadService.prepareDownload(
      query,
      config,
      downloadType,
      selectedRecordState
    );

    expect(prep.query).to.have.property("isInvalid", false);
    expect(prep.query).to.have.property("File", 1);
    expect(prep.config.file).to.deep.equal(file);
  });

  it("on all file download sets query.$or.isDuplicate/WithinFile, config.file, config.recordStates", function() {
    var query = file;
    var downloadType = {
      byCampaign: false,
      byFile: true,
      byList: false,
      bySource: false
    };
    var selectedRecordState = "All";

    var prep = downloadService.prepareDownload(
      query,
      config,
      downloadType,
      selectedRecordState
    );
    expect(prep.query.isInvalid).to.not.exist;
    expect(prep.query.$or).to.have.property("isDuplicate", true);
    expect(prep.query.$or).to.have.property("isDuplicateWithinFile", true);
    expect(prep.query).to.have.property("File", 1);
    expect(prep.config.file).to.deep.equal(file);
    expect(prep.config.recordStates).to.deep.equal(expectedRecordState);
  });

  it("on clean source download sets  query.Created.$gte/$lte, config.source and isInvalid to false", function() {
    var query = { Name: "Test Source", _id: 1 };
    var downloadType = {
      byCampaign: false,
      byFile: false,
      byList: false,
      bySource: true
    };
    var selectedRecordState = "Clean";
    var prep = downloadService.prepareDownload(
      query,
      config,
      downloadType,
      selectedRecordState
    );

    expect(prep.query).to.have.property("isInvalid", false);
    expect(prep.query).to.have.property("Source", 1);
    expect(prep.query.Created).to.have.property("$gte");
    expect(prep.query.Created).to.have.property("$lt");
    expect(prep.config.source).to.deep.equal(query);
  });

  it("on all source download sets query.Created.$gte/$lte, query.$or.isDuplicate/WithinFile, config.source, config.recordStates", function() {
    var query = { Name: "Test Source", _id: 1 };
    var downloadType = {
      byCampaign: false,
      byFile: false,
      byList: false,
      bySource: true
    };
    var selectedRecordState = "All";

    var prep = downloadService.prepareDownload(
      query,
      config,
      downloadType,
      selectedRecordState
    );
    expect(prep.query.isInvalid).to.not.exist;
    expect(prep.query.$or).to.have.property("isDuplicate", true);
    expect(prep.query.$or).to.have.property("isDuplicateWithinFile", true);
    expect(prep.query).to.have.property("Source", 1);
    expect(prep.query.Created).to.have.property("$gte");
    expect(prep.query.Created).to.have.property("$lt");
    expect(prep.config.source).to.deep.equal(query);
    expect(prep.config.recordStates).to.deep.equal(expectedRecordState);
  });

  it("on clean list download sets  config.list and isInvalid to false", function() {
    var query = { Name: "Test List", _id: 1 };
    var downloadType = {
      byCampaign: false,
      byFile: false,
      byList: true,
      bySource: false
    };
    var selectedRecordState = "Clean";
    var prep = downloadService.prepareDownload(
      query,
      config,
      downloadType,
      selectedRecordState
    );
    expect(prep.query).to.have.property("isInvalid", false);
    expect(prep.query).to.have.property("List", 1);
    expect(prep.config.list).to.deep.equal(query);
  });

  it("on all list  download sets query.$or.isDuplicate/WithinFile, config.source, config.recordStates", function() {
    var query = { Name: "Test List", _id: 1 };
    var downloadType = {
      byCampaign: false,
      byFile: false,
      byList: true,
      bySource: false
    };
    var selectedRecordState = "All";

    var prep = downloadService.prepareDownload(
      query,
      config,
      downloadType,
      selectedRecordState
    );

    expect(prep.query.isInvalid).to.not.exist;
    expect(prep.query.$or).to.have.property("isDuplicate", true);
    expect(prep.query.$or).to.have.property("isDuplicateWithinFile", true);
    expect(prep.query).to.have.property("List", 1);
    expect(prep.config.list).to.deep.equal(query);
    expect(prep.config.recordStates).to.deep.equal(expectedRecordState);
  });
});
