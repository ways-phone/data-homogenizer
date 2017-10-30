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

var ListCreator = require("../services/create-list/ListCreator");

describe("List Creator", function() {
  var record;
  var record2;
  var record3;
  var record4;
  var source = new Source();
  var source2 = new Source();
  var file = new File();
  var file2 = new File();
  var newList;
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
      Files: [file._id, file2._id],
      Lists: [],
      Sources: [source._id, source2._id]
    });

    file.Name = "File 1";
    file.Campaign = campaign._id;
    file.Client = client._id;

    file2.Name = "File 2";
    file2.Campaign = campaign._id;
    file2.Client = client._id;

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

    record = new Record({
      FirstName: "Test",
      LastName: "Testerson",
      File: file._id,
      Source: source._id,
      Campaign: campaign._id,
      Client: client._id,
      MobilePhone: "498092179",
      Title: "Mr",
      Address1: "22 Test St",
      Suburb: "Testington",
      State: "NSW",
      Postcode: "2000",
      DOB: "27/09/1991",
      Timestamp: "06/06/2017"
    });

    record2 = new Record({
      FirstName: "Second File",
      LastName: "Testerson",
      File: file._id,
      Source: source2._id,
      Campaign: campaign._id,
      Client: client._id,
      MobilePhone: "498092179",
      Title: "Mr",
      Address1: "22 Test St",
      Suburb: "Testington",
      State: "NSW",
      Postcode: "2000",
      DOB: "27/09/1991",
      Timestamp: "06/06/2017"
    });

    record3 = new Record({
      FirstName: "Third File",
      LastName: "Testerson",
      File: file._id,
      Source: source2._id,
      Campaign: campaign._id,
      Client: client._id,
      MobilePhone: "498092178",
      Title: "Mr",
      Address1: "22 Test St",
      Suburb: "Testington",
      State: "NSW",
      Postcode: "2000",
      DOB: "27/09/1991",
      Timestamp: "06/06/2017"
    });

    record4 = new Record({
      FirstName: "Fourth File",
      LastName: "Testerson",
      File: file2._id,
      Source: source2._id,
      Campaign: campaign._id,
      Client: client._id,
      MobilePhone: "498092168",
      Title: "Mr",
      Address1: "22 Test St",
      Suburb: "Testington",
      State: "NSW",
      Postcode: "2000",
      DOB: "27/09/1991",
      Timestamp: "06/06/2017"
    });
    config = {
      client: client,
      campaign: campaign,
      count: 10,
      date: [2017, 5, 23]
    };

    return Promise.all([
      user.save(),
      client.save(),
      campaign.save(),
      file.save(),
      file2.save(),
      source.save(),
      source2.save(),
      record3.save(),
      record4.save(),
      record.save().then(function() {
        return record2.save().catch(function() {});
      })
    ]);
  });

  afterEach(function(done) {
    Promise.all([
      mongoose.connection.collections.campaigns.remove(),
      mongoose.connection.collections.lists.remove(),
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

  it("should return an object which has a name, campaign and count", function(
    done
  ) {
    config.search = {
      State: "NSW"
    };
    ListCreator(config)
      .create()
      .then(function(result) {
        expect(result.listName).to.exist;
        expect(result.campaign).to.exist;
        expect(result.count).to.exist;
        done();
      });
  });

  it("should set the correct List Name", function(done) {
    config.search = {
      State: "NSW"
    };
    ListCreator(config)
      .create()
      .then(function(result) {
        expect(result.listName).to.eq("TTT Test_[NSW]_230617_(10)");
        done();
      });
  });

  it("should set the correct Count", function(done) {
    config.search = {
      State: "NSW"
    };
    ListCreator(config)
      .create()
      .then(function(result) {
        expect(result.count).to.eq(3);
        done();
      });
  });

  it("should add the List to the campaign", function(done) {
    config.search = {
      State: "NSW"
    };
    expect(campaign.Lists).to.have.length(0);
    ListCreator(config)
      .create()
      .then(function(result) {
        expect(result.campaign.Lists).to.have.length(1);

        done();
      });
  });

  it("should set the records list property", function(done) {
    config.search = {
      State: "NSW"
    };
    expect(campaign.Lists).to.have.length(0);
    ListCreator(config)
      .create()
      .then(function(result) {
        var list_id = result.campaign.Lists[0];
        expect(Record.find({ List: list_id }))
          .to.eventually.have.length(3)
          .notify(done);
      });
  });
});
