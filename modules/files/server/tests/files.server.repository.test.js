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

var Repo = require("../repository/files.server.repository");

describe("File Repository", function() {
  var record;
  var record2;
  var record3;
  var source = new Source();
  var source2 = new Source();
  var file = new File();
  var list = new List();
  var list2 = new List();
  var file2 = new File();
  var newList;
  var client;
  var campaign;
  var user;
  var dataset;
  var exporter;
  before(function() {
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
      Lists: [list._id, list2._id],
      Sources: [source._id, source2._id]
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

    list2.Name = "List 2";
    list2.Campaign = campaign._id;
    list2.Count = 1;

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
      File: file._id,
      List: list2._id,
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
      List: list2._id,
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

    return Promise.all([
      user.save(),
      client.save(),
      campaign.save(),
      file.save(),
      file2.save(),
      source.save(),
      source2.save(),
      list.save(),
      dataset.save(),
      record3.save(),
      record.save().then(function() {
        return record2.save().catch(function() {});
      })
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

  describe("Get FileInfo", function() {
    it("should retrieve all campaign files and files which have lists", function() {
      return Promise.all([
        expect(Repo.get(campaign)).to.eventually.have.property("all"),
        expect(Repo.get(campaign)).to.eventually.have.property("listFiles")
      ]);
    });

    it("should retrieve all campaign files with the correct counts", function(
      done
    ) {
      Repo.get(campaign).then(function(fileInfo) {
        var all = fileInfo.all;
        expect(all[0]).to.have.property("total", 3);
        expect(all[0]).to.have.property("dupeCount", 1);
        done();
      });
    });

    it("should retrieve all campaign files with populated sources", function(
      done
    ) {
      Repo.get(campaign).then(function(fileInfo) {
        var sources = fileInfo.all[0].sources;
        var lists = fileInfo.all[0].lists;
        expect(sources).to.have.length(2);
        expect(sources[0]).to.have.property(
          "DisplayName",
          "8th Floor - Stand Alone"
        );
        expect(sources[1]).to.have.property(
          "DisplayName",
          "Cohort - Stand Alone"
        );
        done();
      });
    });

    it("should retrieve all campaign files with populated lists", function(
      done
    ) {
      Repo.get(campaign).then(function(fileInfo) {
        var lists = fileInfo.all[0].lists;
        expect(lists).to.have.length(1);
        expect(lists[0]).to.have.property("Name", "Test List");
        done();
      });
    });
  });

  describe("Remove File and Records", function() {
    it("should remove file from campaign", function(done) {
      expect(campaign.Files).to.have.length(2);
      Repo.remove({ File: file._id }, campaign).then(function(campaign) {
        expect(campaign.Files).to.have.length(1);
        done();
      });
    });

    it("should remove file from Files and all records", function() {
      return Repo.remove({ File: file2._id }, campaign).then(function(
        campaign
      ) {
        return Promise.all([
          expect(File.find({})).to.eventually.have.length(0),
          expect(Record.find({})).to.eventually.have.length(0)
        ]);
      });
    });
  });
});
