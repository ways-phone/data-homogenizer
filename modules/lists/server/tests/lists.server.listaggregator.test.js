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

var aggregator = require("../services/ListAggregator");

describe("List Aggregator", function() {
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

  var stateQ;
  var stateAndGenderQ;
  var sourceQ;
  var fileQ;
  var fileAndSourceQ;
  before(function() {
    if (mongoose.connection) {
      mongoose.connection.close(function() {
        var config = require("../../../../config/mongoose");
        mongoose = config(true);
      });
    }

    stateQ = '{"$group":{"State":"$State"}}';

    stateAndGenderQ = '{"$group":{"State":"$State","Gender":"$Gender"}}';

    sourceQ =
      '{"$group":{"Source":"$Source"},' +
      '"lookup1":{"from":"sources","localField":"_id.Source",' +
      '"foreignField":"_id","as":"_id.Source"},' +
      '"unwind1":"$_id.Source",' +
      '"project1":{"_id":0}}';

    fileQ =
      '{"$group":{"File":"$File"},' +
      '"lookup2":{"from":"files","localField":"_id.File",' +
      '"foreignField":"_id","as":"_id.File"},' +
      '"unwind2":"$_id.File"}';

    fileAndSourceQ =
      '{"$group":{"File":"$File","Source":"$Source"},' +
      '"lookup1":{"from":"sources","localField":"_id.Source",' +
      '"foreignField":"_id","as":"_id.Source"},' +
      '"unwind1":"$_id.Source",' +
      '"project1":{"_id":0},' +
      '"lookup2":{"from":"files","localField":"_id.File",' +
      '"foreignField":"_id","as":"_id.File"},' +
      '"unwind2":"$_id.File"}';

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
      State: "VIC",
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
      record3.save(),
      record4.save(),
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

  it("should return a list of two objects with the correct counts for a state query", function(
    done
  ) {
    aggregator.create(stateQ, campaign._id).then(function(aggregate) {
      expect(aggregate).to.have.length(2);
      expect(aggregate[0]._id).to.have.property("State", "VIC");
      expect(aggregate[0]).to.have.property("count", 1);
      expect(aggregate[1]._id).to.have.property("State", "NSW");
      expect(aggregate[1]).to.have.property("count", 2);
      done();
    });
  });
  it("should return a list of 2 objects with the correct counts for a gender and state query", function(
    done
  ) {
    aggregator.create(stateAndGenderQ, campaign._id).then(function(aggregate) {
      expect(aggregate).to.have.length(2);
      expect(aggregate[0]._id).to.have.property("State", "VIC");
      expect(aggregate[0]._id).to.have.property("Gender", "Male");
      expect(aggregate[0]).to.have.property("count", 1);
      expect(aggregate[1]._id).to.have.property("State", "NSW");
      expect(aggregate[1]._id).to.have.property("Gender", "Male");
      expect(aggregate[1]).to.have.property("count", 2);
      done();
    });
  });
  it("should return a list of 2 objects with the correct counts and populated field for a source query", function(
    done
  ) {
    aggregator.create(sourceQ, campaign._id).then(function(aggregate) {
      expect(aggregate).to.have.length(2);

      expect(aggregate[0]).to.have.property("count", 1);
      expect(aggregate[0]._id.Source).to.have.property(
        "DisplayName",
        "8th Floor - Stand Alone"
      );

      expect(aggregate[1]).to.have.property("count", 2);
      expect(aggregate[1]._id.Source).to.have.property(
        "DisplayName",
        "Cohort - Stand Alone"
      );
      done();
    });
  });

  it("should return a list of 2 objects with the correct counts and populated fields for a source and file query", function(
    done
  ) {
    aggregator
      .create(fileAndSourceQ, campaign._id)
      .then(function(aggregate) {
        expect(aggregate).to.have.length(3);

        expect(aggregate[0]).to.have.property("count", 1);
        expect(aggregate[0]._id.Source).to.have.property(
          "DisplayName",
          "8th Floor - Stand Alone"
        );
        expect(aggregate[0]._id.File).to.have.property("Name", "File 1");

        expect(aggregate[1]).to.have.property("count", 1);
        expect(aggregate[1]._id.Source).to.have.property(
          "DisplayName",
          "Cohort - Stand Alone"
        );
        expect(aggregate[1]._id.File).to.have.property("Name", "File 2");

        expect(aggregate[2]).to.have.property("count", 1);
        expect(aggregate[2]._id.Source).to.have.property(
          "DisplayName",
          "Cohort - Stand Alone"
        );
        expect(aggregate[2]._id.File).to.have.property("Name", "File 1");

        done();
      })
      .catch(function(error) {
        throw new Error(error);
      });
  });
});
