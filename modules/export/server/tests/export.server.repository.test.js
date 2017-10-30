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

var Repo = require("../repository/export.server.repository");

describe("Export Repository", function() {
  var record;
  var source = new Source();
  var file = new File();
  var list = new List();
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

    return Promise.all([
      user.save(),
      client.save(),
      campaign.save(),
      file.save(),
      source.save(),
      list.save(),
      newList.save(),
      dataset.save(),
      record.save()
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

  it("should correctly create dataset from the selected lists", function(done) {
    Repo.add({
      campaign: campaign,
      lists: [list],
      name: "Test Dataset"
    }).then(function(results) {
      expect(results.dataset).to.exist;
      expect(results.dataset).to.have.property("Name", "Test Dataset");
      expect(results.dataset).to.have.property("ID");
      expect(results.dataset).to.have.property("isExported", false);
      expect(results.dataset)
        .to.have.property("List")
        .and.to.have.length(1);
      done();
    });
  });

  it("should correctly create mark lists as exported", function(done) {
    Repo.add({
      campaign: campaign,
      lists: [list],
      name: "Test Dataset"
    }).then(function(results) {
      expect(results.lists).to.exist;
      expect(results.lists).to.have.length(1);
      expect(results.lists[0]).to.have.property("Name", "Test List");
      expect(results.lists[0]).to.have.property("isExported", true);

      done();
    });
  });

  it("should succesfully add a list to an existing dataset", function(done) {
    Repo.update([newList], dataset).then(function(dataset) {
      expect(dataset.List).to.have.length(2);

      done();
    });
  });

  it("should succesfully mark the list as exported", function() {
    return Repo.update([newList], dataset).then(function(dataset) {
      return expect(List.findById(newList._id)).to.eventually.have.property(
        "isExported",
        true
      );
    });
  });

  it("should retrieve all datasets and populate lists", function(done) {
    Repo.get(campaign).then(function(datasets) {
      expect(datasets[0].List).to.have.length(3);
      expect(datasets[0].List[0]).to.have.property("isExported", true);

      done();
    });
  });

  it("Should delete dataset and mark all lists as not exported", function(
    done
  ) {
    Repo.remove(dataset._id)
      .then(function(removed) {
        CsDataset.findById(removed._id)
          .then(function(dataset) {
            expect(dataset).to.not.exist;

            expect(removed.List).to.have.length(3);

            expect(removed.List[0]).to.have.property("isExported", false);

            expect(removed.List[1]).to.have.property("isExported", false);

            expect(removed.List[2]).to.have.property("isExported", false);

            done();
          })
          .catch(function(err) {
            console.error(err);
            done();
          });
      })
      .catch(function(error) {
        console.error(error);
        done();
      });
  });
});
