"use strict";
describe("Download File Service", function() {
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
  var downloadFileService;
  var expectedRecordState;
  var source;
  var list;
  beforeEach(
    inject(function(DownloadFileService) {
      downloadFileService = DownloadFileService;

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
      source = {
        DisplayName: "Test Source - Grid",
        Created: new Date(),
        _id: 1
      };
      list = {
        Name: "test list",
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
        start: new Date(2017, 3, 3),
        end: new Date(2017, 3, 4),
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

  it('create a clean campaign file name and not include "is" headers', function() {
    var results = downloadFileService.prepareFileForDownload(config);
    expect(results.headers).to.deep.equal([
      "CustKey",
      "Phone1",
      "Phone2",
      "DOB",
      "Gender",
      "Title",
      "FirstName",
      "LastName",
      "Address1",
      "Address2",
      "Suburb",
      "State",
      "Postcode",
      "Email",
      "MobilePhone",
      "HomePhone",
      "SiteLabel",
      "Source",
      "Client",
      "Campaign",
      "File",
      "List"
    ]);
    expect(results.filename).to.equal(
      "MSF Lead Conversion 030417-040417 (Clean).csv"
    );
  });

  it('create an all campaign file name and include "is" headers', function() {
    config.recordStates = expectedRecordState;
    var results = downloadFileService.prepareFileForDownload(config);

    expect(results.headers).to.deep.equal([
      "CustKey",
      "Phone1",
      "Phone2",
      "DOB",
      "Gender",
      "Title",
      "FirstName",
      "LastName",
      "Address1",
      "Address2",
      "Suburb",
      "State",
      "Postcode",
      "Email",
      "MobilePhone",
      "HomePhone",
      "SiteLabel",
      "Source",
      "Client",
      "Campaign",
      "File",
      "List",
      "isDuplicate",
      "isDuplicateWithinFile",
      "isInvalid"
    ]);
    expect(results.filename).to.equal(
      "MSF Lead Conversion 030417-040417 (All).csv"
    );
  });

  it('create a clean file download file name and not include "is" headers', function() {
    config.file = file;
    config.downloadType = {
      byCampaign: false,
      byFile: true,
      byList: false,
      bySource: false
    };
    var results = downloadFileService.prepareFileForDownload(config);

    expect(results.headers).to.deep.equal([
      "CustKey",
      "Phone1",
      "Phone2",
      "DOB",
      "Gender",
      "Title",
      "FirstName",
      "LastName",
      "Address1",
      "Address2",
      "Suburb",
      "State",
      "Postcode",
      "Email",
      "MobilePhone",
      "HomePhone",
      "SiteLabel",
      "Source",
      "Client",
      "Campaign",
      "File",
      "List"
    ]);
    expect(results.filename).to.equal("test file (Clean).csv");
  });

  it('create an all file download file name and include "is" headers', function() {
    config.recordStates = expectedRecordState;
    config.file = file;
    config.downloadType = {
      byCampaign: false,
      byFile: true,
      byList: false,
      bySource: false
    };
    var results = downloadFileService.prepareFileForDownload(config);

    expect(results.headers).to.deep.equal([
      "CustKey",
      "Phone1",
      "Phone2",
      "DOB",
      "Gender",
      "Title",
      "FirstName",
      "LastName",
      "Address1",
      "Address2",
      "Suburb",
      "State",
      "Postcode",
      "Email",
      "MobilePhone",
      "HomePhone",
      "SiteLabel",
      "Source",
      "Client",
      "Campaign",
      "File",
      "List",
      "isDuplicate",
      "isDuplicateWithinFile",
      "isInvalid"
    ]);
    expect(results.filename).to.equal("test file (All).csv");
  });

  it('create a clean source download file name and not include "is" headers', function() {
    config.source = source;
    config.downloadType = {
      byCampaign: false,
      byFile: false,
      byList: false,
      bySource: true
    };
    var results = downloadFileService.prepareFileForDownload(config);

    expect(results.headers).to.deep.equal([
      "CustKey",
      "Phone1",
      "Phone2",
      "DOB",
      "Gender",
      "Title",
      "FirstName",
      "LastName",
      "Address1",
      "Address2",
      "Suburb",
      "State",
      "Postcode",
      "Email",
      "MobilePhone",
      "HomePhone",
      "SiteLabel",
      "Source",
      "Client",
      "Campaign",
      "File",
      "List"
    ]);
    expect(results.filename).to.equal(
      "MSF Lead Conversion - Test Source - Grid 030417-040417 (Clean).csv"
    );
  });

  it('create an all source download file name and include "is" headers', function() {
    config.recordStates = expectedRecordState;
    config.source = source;
    config.downloadType = {
      byCampaign: false,
      byFile: false,
      byList: false,
      bySource: true
    };
    var results = downloadFileService.prepareFileForDownload(config);

    expect(results.headers).to.deep.equal([
      "CustKey",
      "Phone1",
      "Phone2",
      "DOB",
      "Gender",
      "Title",
      "FirstName",
      "LastName",
      "Address1",
      "Address2",
      "Suburb",
      "State",
      "Postcode",
      "Email",
      "MobilePhone",
      "HomePhone",
      "SiteLabel",
      "Source",
      "Client",
      "Campaign",
      "File",
      "List",
      "isDuplicate",
      "isDuplicateWithinFile",
      "isInvalid"
    ]);
    expect(results.filename).to.equal(
      "MSF Lead Conversion - Test Source - Grid 030417-040417 (All).csv"
    );
  });

  it('create a clean list download file name and not include "is" headers', function() {
    config.list = list;
    config.downloadType = {
      byCampaign: false,
      byFile: false,
      byList: true,
      bySource: false
    };
    var results = downloadFileService.prepareFileForDownload(config);

    expect(results.headers).to.deep.equal([
      "CustKey",
      "Phone1",
      "Phone2",
      "DOB",
      "Gender",
      "Title",
      "FirstName",
      "LastName",
      "Address1",
      "Address2",
      "Suburb",
      "State",
      "Postcode",
      "Email",
      "MobilePhone",
      "HomePhone",
      "SiteLabel",
      "Source",
      "Client",
      "Campaign",
      "File",
      "List"
    ]);
    expect(results.filename).to.equal("test list (Clean).csv");
  });

  it('creates an all list download file name and include "is" headers', function() {
    config.recordStates = expectedRecordState;
    config.list = list;
    config.downloadType = {
      byCampaign: false,
      byFile: false,
      byList: true,
      bySource: false
    };

    var results = downloadFileService.prepareFileForDownload(config);

    expect(results.headers).to.deep.equal([
      "CustKey",
      "Phone1",
      "Phone2",
      "DOB",
      "Gender",
      "Title",
      "FirstName",
      "LastName",
      "Address1",
      "Address2",
      "Suburb",
      "State",
      "Postcode",
      "Email",
      "MobilePhone",
      "HomePhone",
      "SiteLabel",
      "Source",
      "Client",
      "Campaign",
      "File",
      "List",
      "isDuplicate",
      "isDuplicateWithinFile",
      "isInvalid"
    ]);
    expect(results.filename).to.equal("test list (All).csv");
  });
});
