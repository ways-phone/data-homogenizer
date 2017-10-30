"use strict";

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var Promise = require("bluebird");
var expect = chai.expect;

var mongoose = require("mongoose");
var Campaign = mongoose.model("Campaign");
var List = mongoose.model("List");
var Source = mongoose.model("Source");
var Client = mongoose.model("Client");
var User = mongoose.model("User");
var File = mongoose.model("File");
var Record = mongoose.model("Record");
var Dupes = mongoose.model("DupeRecord");
var Header = mongoose.model("Header");

var RecordSaver = require("../services/RecordSaver");

describe("Record Saver", function() {
  var record;
  var record2;
  var record3;
  var record4;
  var source = new Source();
  var source2 = new Source();
  var header;
  var client;
  var campaign;
  var user;
  var config;

  beforeEach(function() {
    if (mongoose.connection) {
      mongoose.connection.close(function() {
        var config = require("../../../../config/mongoose");
        mongoose = config(true);
      });
    }
    user = new User({
      FirstName: "Test",
      LastName: "Testerson",
      Department: "Data",
      Email: "t@tsss.com"
    });
    client = new Client({
      Name: "Test1",
      Acronym: "TTT",
      Type: "test",
      Creator: user._id,
      Campaigns: [campaign]
    });

    campaign = new Campaign({
      Name: "Test",
      Client: client._id,
      Creator: user._id,
      Conversion: 0.04,
      ContactRate: 45,
      ContactSpaceID: 10,
      Files: [],
      Lists: [],
      Sources: [source._id, source2._id]
    });

    source.Name = "8th Floor";
    source.Type = "Stand Alone";
    source.Campaign = campaign._id;
    source.Cost = 4.5;
    source.Provider = "TPS";

    source2.Name = "Cohort";
    source2.Type = "Stand Alone";
    source2.Campaign = campaign._id;
    source2.Cost = 4.5;
    source2.Provider = "TPS";

    record = {
      FirstName: "Test",
      LastName: "Testerson",
      Source: source._id,
      Campaign: campaign._id,
      MobilePhone: "498092179",
      Title: "Mr",
      Address1: "22 Test St",
      Suburb: "Testington",
      State: "NSW",
      Postcode: "2000",
      DOB: "27/09/1991",
      Timestamp: "06/06/2017"
    };

    record2 = {
      FirstName: "Second File",
      LastName: "Testerson",
      Source: source2._id,
      MobilePhone: "498092179",
      Title: "Mr",
      Address1: "22 Test St",
      Suburb: "Testington",
      State: "NSW",
      Postcode: "2000",
      DOB: "27/09/1991",
      Timestamp: "06/06/2017"
    };

    record3 = {
      FirstName: "Third File",
      LastName: "Testerson",
      Source: source2._id,
      MobilePhone: "498092178",
      Title: "Mr",
      Address1: "22 Test St",
      Suburb: "Testington",
      State: "NSW",
      Postcode: "2000",
      DOB: "27/09/1991",
      Timestamp: "06/06/2017"
    };

    header = new Header({
      CustKey: "Consumer ID",
      HomePhone: "Home",
      MobilePhone: "Mobile",
      DOB: "Date of Birth",
      Gender: "Sex",
      Title: "Title",
      FirstName: "First",
      LastName: "Last",
      Address1: "address",
      Suburb: "City",
      State: "state",
      Postcode: "zip",
      Email: "email",
      SiteLabel: "source",
      Extra1: "domain",
      Campaign: campaign._id,
      Client: client._id
    });
    record4 = {
      FirstName: "Fourth File",
      LastName: "Testerson",
      Source: source2._id,
      MobilePhone: "498092168",
      Title: "Mr",
      Address1: "22 Test St",
      Suburb: "Testington",
      State: "NSW",
      Postcode: "2000",
      DOB: "27/09/1991",
      Timestamp: "06/06/2017"
    };
    config = {
      client: client,
      campaign: campaign,
      filename: "Test File",
      Header: header._id,
      records: [record, record2, record3, record4]
    };

    return Promise.all([
      user.save(),
      client.save(),
      campaign.save(),
      source.save(),
      source2.save(),
      header.save()
    ]);
  });

  afterEach(function(done) {
    Promise.all([
      mongoose.connection.collections.campaigns.remove(),
      mongoose.connection.collections.lists.remove(),
      mongoose.connection.collections.dupes.remove(),
      mongoose.connection.collections.csdatasets.remove(),
      mongoose.connection.collections.files.remove(),
      mongoose.connection.collections.sources.remove(),
      mongoose.connection.collections.clients.remove(),
      mongoose.connection.collections.users.remove(),
      mongoose.connection.collections.records.remove()
    ]).spread(function() {
      done();
    });
  });

  it("should return the counts and the campaign", function(done) {
    var saver = RecordSaver(config, campaign, client);

    saver
      .save()
      .then(function(result) {
        expect(result.response.dupes).to.exist;
        expect(result.response.dupesWithinFile).to.exist;
        expect(result.response.count).to.exist;
        expect(result.campaign).to.exist;
        done();
      })
      .catch(function(error) {
        console.log(error);
        done();
      });
  });

  it("should add the file to the campaign", function(done) {
    var saver = RecordSaver(config, campaign, client);

    saver
      .save()
      .then(function(result) {
        expect(result.campaign.Files).to.have.length(1);
        done();
      })
      .catch(function(error) {
        console.log(error);
        done();
      });
  });

  it("should have the correct counts", function(done) {
    var saver = RecordSaver(config, campaign, client);

    saver
      .save()
      .then(function(result) {
        expect(result.response.dupes).to.eql(0);
        expect(result.response.dupesWithinFile).to.eql(1);
        expect(result.response.count).to.eql(4);
        done();
      })
      .catch(function(error) {
        console.log(error);
        done();
      });
  });

  it("should save 3 records in the records table", function() {
    var saver = RecordSaver(config, campaign, client);

    return saver.save().then(function(result) {
      return expect(Record.find({})).to.eventually.have.length(3);
    });
  });
  it("should save 1 records in the dupes table", function() {
    var saver = RecordSaver(config, campaign, client);

    return saver.save().then(function(result) {
      return expect(Dupes.find({})).to.eventually.have.length(1);
    });
  });
});
