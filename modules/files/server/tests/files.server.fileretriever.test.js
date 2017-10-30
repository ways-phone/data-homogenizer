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
var CsDataset = mongoose.model("CsDataset");

var retriever = require("../services/FileRetriever");

describe("File Retriever", function() {
  var record;
  var record2;
  var source = new Source();
  var file = new File();
  var list = new List();
  var file2 = new File();
  var newList;
  var client;
  var campaign;
  var user;
  var dataset;
  var exporter;
  before(function() {
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
      Lists: [list._id],
      Sources: [source._id]
    });

    file.Name = "List File";
    file.Campaign = campaign._id;
    file.Client = client._id;

    file2.Name = "Non List File";
    file2.Campaign = campaign._id;
    file2.Client = client._id;

    list.Name = "Test List";
    list.Campaign = campaign._id;
    list.Count = 1;

    newList = new List({
      Name: "New List",
      Campaign: campaign,
      Count: 1
    });

    source.Name = "8th Floor";
    source.Type = "Stand Alone";
    source.Campaign = campaign._id;
    source.Cost = 4.5;
    source.Provider = "TPS";

    dataset = new CsDataset({
      Name: "Test Dataset",
      ID: 4,
      Campaign: campaign._id,
      List: [list._id]
    });

    record = new Record({
      FirstName: "Test",
      LastName: "Testerson",
      File: file._id,
      Source: source._id,
      List: list._id,
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
      File: file2._id,
      Source: source._id,
      Campaign: campaign._id,
      Client: client._id,
      MobilePhone: "498092173",
      Title: "Mr",
      Address1: "22 Test St",
      Suburb: "Testington",
      State: "NSW",
      Postcode: "2000",
      DOB: "27/09/1991",
      Timestamp: "06/06/2017"
    });

    return Promise.all([
      user.save(),
      client.save(),
      campaign.save(),
      file.save(),
      file2.save(),
      source.save(),
      list.save(),
      newList.save(),
      dataset.save(),
      record.save(),
      record2.save()
    ]);
  });

  after(function(done) {
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

  it("should a fileinfo object which has an array of all files and listFiles", function(
    done
  ) {
    retriever.all(campaign).then(function(fileInfo) {
      expect(fileInfo).to.have.property("all");
      expect(fileInfo).to.have.property("listFiles");
      done();
    });
  });

  it("should return and array of 2 files for all files and 1 list files", function(
    done
  ) {
    retriever.all(campaign).then(function(fileInfo) {
      expect(fileInfo.all).to.have.length(2);
      expect(fileInfo.listFiles).to.have.length(1);
      done();
    });
  });
});
