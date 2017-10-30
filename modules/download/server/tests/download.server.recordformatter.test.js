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
var formatter = require("../services/index").recordFormatter;

describe("Download Record Formatter", function() {
  var records;
  before(function(done) {
    records = [
      new Record({
        FirstName: "Test",
        LastName: "Testerson",
        File: new File({ Name: "Test File" }),
        Source: new Source({
          Name: "8th Floor",
          Type: "Stand Alone",
          DisplayName: "8th Floor - Stand Alone"
        }),
        List: new List({ Name: "Test List" }),
        Campaign: new Campaign({ Name: "Test Campaign" }),
        Client: new Client({ Name: "Test Client" }),
        MobilePhone: "498092179",
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
      })._doc
    ];
    done();
  });

  it("should handle nested objects when formatting records", function(done) {
    formatter.format(records).then(function(formatted) {
      var record = formatted[0];

      expect(record).to.have.property("Campaign", "Test Campaign");
      expect(record).to.have.property("Source", "8th Floor - Stand Alone");
      expect(record).to.have.property("List", "Test List");
      expect(record).to.have.property("File", "Test File");
      expect(record).to.have.property("Client", "Test Client");
      done();
    });
  });

  it("should include all non nested keys without changing them", function(
    done
  ) {
    formatter.format(records).then(function(formatted) {
      var record = formatted[0];
      expect(record).to.have.property("Title", "Mr");
      expect(record).to.have.property("FirstName", "Test");
      expect(record).to.have.property("LastName", "Testerson");
      expect(record).to.have.property("Address1", "22 Test St");
      expect(record).to.have.property("Timestamp", "06.06.2017");
      expect(record).to.have.property("Suburb", "TESTINGTON");
      expect(record).to.have.property("State", "NSW");
      expect(record).to.have.property("Postcode", "2000");
      expect(record).to.have.property("_id", records[0]._id);
      expect(record).to.have.property("MobilePhone", "498092179");

      done();
    });
  });
});
