"use strict";

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var Promise = require("bluebird");
var expect = chai.expect;

var mongoose = require("mongoose");
var Record = mongoose.model("Record");
var Client = mongoose.model("Client");
var Campaign = mongoose.model("Campaign");
var Source = mongoose.model("Source");
var File = mongoose.model("File");
var List = mongoose.model("List");
var User = mongoose.model("User");

var Repo = require("../repository/download.server.repository");

describe("Download Repository", function() {
  var record;
  var dupeWithinFile;
  var dupe;
  var invalid;
  var source = new Source();
  var file = new File();
  var file2 = new File();
  var list = new List();
  var client;
  var campaign;
  var user;

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
      Files: [file._id],
      Lists: [list._id],
      Sources: [source._id]
    });

    file.Name = "Test File";
    file.Campaign = campaign._id;
    file.Client = client._id;

    file2.Name = "Test File 2";
    file2.Campaign = campaign._id;
    file2.Client = client._id;

    list.Name = "Test List";
    list.Campaign = campaign._id;
    list.Count = 1;

    source.Name = "8th Floor";
    source.Type = "Stand Alone";
    source.Campaign = campaign._id;
    source.Cost = 4.5;
    source.Provider = "TPS";

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

    dupeWithinFile = new Record({
      FirstName: "Dupe Within File",
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
    dupe = new Record({
      FirstName: "Dupe Within Campaign",
      LastName: "Testerson",
      File: file2._id,
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
    invalid = new Record({
      FirstName: "Invalid",
      LastName: "Testerson",
      File: file._id,
      Source: source._id,
      Campaign: campaign._id,
      Client: client._id,
      MobilePhone: "",
      Title: "Mr",
      Address1: "22 Test St",
      Suburb: "Testington",
      State: "NSW",
      Postcode: "2000",
      isInvalid: false,
      isDuplicate: false,
      isDuplicateWithinFile: false,
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
      invalid.save(),
      record.save().then(function() {
        dupe.save().catch(function() {
          dupeWithinFile.save().catch(function() {});
        });
      })
    ]);
  });

  after("clear db", function(done) {
    mongoose.connection.db.dropDatabase(function() {
      done();
    });
  });
  it("should return a single record for a clean file query", function(done) {
    var fileQ = {
      File: file._id,
      isInvalid: false
    };
    Repo.get(fileQ).then(function(formatted) {
      var saved = formatted[0];
      expect(formatted).to.have.length(1);
      expect(saved).to.have.property("Campaign", "Test");
      expect(saved).to.have.property("Client", "Test1");
      expect(saved).to.have.property("File", "Test File");
      expect(saved).to.have.property("Source", "8th Floor - Stand Alone");
      expect(saved).to.have.property("List", "Test List");
      expect(saved).to.have.property("CustKey");
      expect(saved).to.have.property("Phone1", "61498092179");
      expect(saved).to.have.property("State", "NSW");

      done();
    });
  });

  it("should return a dupe,invalid and clean for an 'all' file query", function(
    done
  ) {
    var fileQ = {
      File: file._id,
      $or: {
        isDuplicate: true,
        isDuplicateWithinFile: true
      }
    };
    Repo.get(fileQ).then(function(formatted) {
      expect(formatted).to.have.length(3);
      var clean = formatted.filter(function(record) {
        return record.FirstName === "Test";
      })[0];
      var dupeWithinFile = formatted.filter(function(record) {
        return record.FirstName === "Dupe Within File";
      })[0];
      var invalid = formatted.filter(function(record) {
        return record.FirstName === "Invalid";
      })[0];
      expect(clean).to.have.property("isDuplicate", false);
      expect(clean).to.have.property("isInvalid", false);
      expect(clean).to.have.property("isDuplicateWithinFile", false);
      expect(dupeWithinFile).to.have.property("isDuplicateWithinFile", true);
      expect(invalid).to.have.property("isInvalid", true);
      done();
    });
  });

  it("Should return a single record for a clean campaign query with correct date range", function(
    done
  ) {
    var campaignQ = {
      Campaign: campaign._id,
      Created:
        '{ "$gte": "2016-06-21T14:00:00.000Z", "$lt": "2117-06-22T13:59:59.059Z" }',
      isInvalid: false
    };
    Repo.get(campaignQ).then(function(formatted) {
      expect(formatted).to.have.length(1);
      expect(formatted[0]).to.have.property("isInvalid", false);
      expect(formatted[0]).to.have.property("isDuplicate", false);
      expect(formatted[0]).to.have.property("isDuplicateWithinFile", false);
      done();
    });
  });
  it("Should return nothing for a clean campaign query with incorrect date range", function(
    done
  ) {
    var campaignQ = {
      Campaign: campaign._id,
      Created:
        '{ "$gte": "2018-06-21T14:00:00.000Z", "$lt": "2117-06-22T13:59:59.059Z" }',
      isInvalid: false
    };
    Repo.get(campaignQ).then(function(formatted) {
      expect(formatted).to.have.length(0);
      done();
    });
  });

  it("should return a dupe, dupeWithinFile, invalid and clean for an 'all' Campaign query with the correct date range", function(
    done
  ) {
    var campaignQ = {
      Campaign: campaign._id,
      Created:
        '{ "$gte": "2007-06-21T14:00:00.000Z", "$lt": "2117-06-22T13:59:59.059Z" }',
      $or: {
        isDuplicate: true,
        isDuplicateWithinFile: true
      }
    };
    Repo.get(campaignQ).then(function(formatted) {
      expect(formatted).to.have.length(4);
      var clean = formatted.filter(function(record) {
        return record.FirstName === "Test";
      })[0];
      var dupeWithinFile = formatted.filter(function(record) {
        return record.FirstName === "Dupe Within File";
      })[0];
      var dupe = formatted.filter(function(record) {
        return record.FirstName === "Dupe Within Campaign";
      })[0];
      var invalid = formatted.filter(function(record) {
        return record.FirstName === "Invalid";
      })[0];
      expect(clean).to.have.property("isDuplicate", false);
      expect(clean).to.have.property("isInvalid", false);
      expect(clean).to.have.property("isDuplicateWithinFile", false);
      expect(dupeWithinFile).to.have.property("isDuplicateWithinFile", true);
      expect(invalid).to.have.property("isInvalid", true);
      expect(dupe).to.have.property("isDuplicate", true);
      done();
    });
  });

  it("Should return nothing for an 'all' campaign query with incorrect date range", function(
    done
  ) {
    var campaignQ = {
      Campaign: campaign._id,
      Created:
        '{ "$gte": "2018-06-21T14:00:00.000Z", "$lt": "2117-06-22T13:59:59.059Z" }',
      $or: {
        isDuplicate: true,
        isDuplicateWithinFile: true
      }
    };
    Repo.get(campaignQ).then(function(formatted) {
      expect(formatted).to.have.length(0);
      done();
    });
  });

  it("should return a single record for a clean list query", function(done) {
    var listQ = {
      List: list._id,
      isInvalid: false
    };
    Repo.get(listQ).then(function(formatted) {
      var saved = formatted[0];
      expect(formatted).to.have.length(1);
      expect(saved).to.have.property("Campaign", "Test");
      expect(saved).to.have.property("Client", "Test1");
      expect(saved).to.have.property("File", "Test File");
      expect(saved).to.have.property("Source", "8th Floor - Stand Alone");
      expect(saved).to.have.property("List", "Test List");
      expect(saved).to.have.property("CustKey");
      expect(saved).to.have.property("Phone1", "61498092179");
      expect(saved).to.have.property("State", "NSW");

      done();
    });
  });

  it("should return a single record for an all list query", function(done) {
    var listQ = {
      List: list._id,
      $or: {
        isDuplicate: true,
        isDuplicateWithinFile: true
      }
    };
    Repo.get(listQ).then(function(formatted) {
      var saved = formatted[0];
      expect(formatted).to.have.length(1);
      expect(saved).to.have.property("Campaign", "Test");
      expect(saved).to.have.property("Client", "Test1");
      expect(saved).to.have.property("File", "Test File");
      expect(saved).to.have.property("Source", "8th Floor - Stand Alone");
      expect(saved).to.have.property("List", "Test List");
      expect(saved).to.have.property("CustKey");
      expect(saved).to.have.property("Phone1", "61498092179");
      expect(saved).to.have.property("State", "NSW");

      done();
    });
  });

  it("should return a single record for a clean source query with correct date range", function(
    done
  ) {
    var sourceQ = {
      Source: source._id,
      Created:
        '{ "$gte": "2007-06-21T14:00:00.000Z", "$lt": "2117-06-22T13:59:59.059Z" }',
      isInvalid: false
    };
    Repo.get(sourceQ).then(function(formatted) {
      var saved = formatted[0];
      expect(formatted).to.have.length(1);
      expect(saved).to.have.property("Campaign", "Test");
      expect(saved).to.have.property("Client", "Test1");
      expect(saved).to.have.property("File", "Test File");
      expect(saved).to.have.property("Source", "8th Floor - Stand Alone");
      expect(saved).to.have.property("List", "Test List");
      expect(saved).to.have.property("CustKey");
      expect(saved).to.have.property("Phone1", "61498092179");
      expect(saved).to.have.property("State", "NSW");

      done();
    });
  });

  it("Should return nothing for a clean source query with incorrect date range", function(
    done
  ) {
    var sourceQ = {
      Source: source._id,
      Created:
        '{ "$gte": "2018-06-21T14:00:00.000Z", "$lt": "2117-06-22T13:59:59.059Z" }',
      isInvalid: false
    };
    Repo.get(sourceQ).then(function(formatted) {
      expect(formatted).to.have.length(0);
      done();
    });
  });

  it("should return a dupe, dupeWithinFile, invalid and clean for an 'all' Source query with the correct date range", function(
    done
  ) {
    var sourceQ = {
      Source: source._id,
      $or: {
        isDuplicate: true,
        isDuplicateWithinFile: true
      }
    };

    Repo.get(sourceQ).then(function(formatted) {
      expect(formatted).to.have.length(4);
      var clean = formatted.filter(function(record) {
        return record.FirstName === "Test";
      })[0];
      var dupeWithinFile = formatted.filter(function(record) {
        return record.FirstName === "Dupe Within File";
      })[0];
      var dupe = formatted.filter(function(record) {
        return record.FirstName === "Dupe Within Campaign";
      })[0];
      var invalid = formatted.filter(function(record) {
        return record.FirstName === "Invalid";
      })[0];
      expect(clean).to.have.property("isDuplicate", false);
      expect(clean).to.have.property("isInvalid", false);
      expect(clean).to.have.property("isDuplicateWithinFile", false);
      expect(dupeWithinFile).to.have.property("isDuplicateWithinFile", true);
      expect(invalid).to.have.property("isInvalid", true);
      expect(dupe).to.have.property("isDuplicate", true);
      done();
    });
  });

  it("Should return nothing for an all source query with incorrect date range", function(
    done
  ) {
    var sourceQ = {
      Source: source._id,
      Created:
        '{ "$gte": "2018-06-21T14:00:00.000Z", "$lt": "2117-06-22T13:59:59.059Z" }',
      $or: {
        isDuplicate: true,
        isDuplicateWithinFile: true
      }
    };
    Repo.get(sourceQ).then(function(formatted) {
      expect(formatted).to.have.length(0);
      done();
    });
  });
});
