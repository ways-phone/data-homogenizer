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

var Exporter = require("../services/RecordExporter");

describe("Record Exporter", function() {
  var record;
  var source = new Source();
  var file = new File();
  var list = new List();
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
      Files: [file._id],
      Lists: [list._id],
      Sources: [source._id]
    });

    file.Name = "Test File";
    file.Campaign = campaign._id;
    file.Client = client._id;

    list.Name = "Test List";
    list.Campaign = campaign._id;
    list.Count = 1;

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

    return Promise.all([
      user.save(),
      client.save(),
      campaign.save(),
      file.save(),
      source.save(),
      list.save(),
      dataset.save(),
      record.save()
    ]).spread(function(
      user,
      client,
      campaign,
      file,
      source,
      list,
      dataset,
      record
    ) {
      exporter = Exporter(dataset);
    });
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

  it("has correctly flattened campaign, client, source, file, list in xml", function(
    done
  ) {
    exporter.getRecordsAsXML().then(function(xmlArr) {
      expect(xmlArr).to.have.length(1);

      var xml = xmlArr[0].split("\n");

      expect(xmlArr[0].indexOf("<File>Test File</File>")).to.not.eq(-1);

      expect(
        xmlArr[0].indexOf("<Source>8th Floor - Stand Alone</Source>")
      ).to.not.eq(-1);

      expect(xmlArr[0].indexOf("<List>Test List</List>")).to.not.eq(-1);

      expect(xmlArr[0].indexOf("<Campaign>Test</Campaign>")).to.not.eq(-1);
      done();
    });
  });

  it("has correct key fields (phone1, name, address, timestamp) in xml", function(
    done
  ) {
    exporter.getRecordsAsXML().then(function(xmlArr) {
      expect(xmlArr).to.have.length(1);

      var xml = xmlArr[0].split("\n");

      expect(
        xmlArr[0].indexOf("<MobilePhone>498092179</MobilePhone>")
      ).to.not.eq(-1);

      expect(xmlArr[0].indexOf("<Phone1>61498092179</Phone1>")).to.not.eq(-1);

      expect(xmlArr[0].indexOf("<Postcode>2000</Postcode>")).to.not.eq(-1);

      expect(xmlArr[0].indexOf("<State>NSW</State>")).to.not.eq(-1);

      expect(xmlArr[0].indexOf("<Suburb>TESTINGTON</Suburb>")).to.not.eq(-1);

      expect(xmlArr[0].indexOf("<FirstName>Test</FirstName>")).to.not.eq(-1);

      expect(xmlArr[0].indexOf("<LastName>Testerson</LastName>")).to.not.eq(-1);
      done();
    });
  });

  it("should update correct record after exporting", function(done) {
    exporter.push().then(function(results) {
      expect(results.n).to.eq(1);
      expect(results.nModified).to.eq(1);
      expect(results.ok).to.eq(1);
      done();
    });
  });

  it("should mark records as exported after push ", function() {
    return exporter.push().then(function() {
      return expect(
        Record.findOne({ _id: record._id })
      ).to.eventually.have.property("isExported", true);
    });
  });

  it("should mark Dataset as exported after push ", function() {
    return exporter.push().then(function() {
      return expect(
        CsDataset.findById(dataset._id)
      ).to.eventually.have.property("isExported", true);
    });
  });
});
