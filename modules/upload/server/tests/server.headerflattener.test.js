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
var Header = mongoose.model("Header");
var Service = require("../services/Header/services");

describe("Header Flattener", function() {
  var file = new File();
  var file2 = new File();
  var client;
  var campaign;
  var user;
  var header;

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
      Lists: [],
      Sources: []
    });

    file.Name = "File 1";
    file.Campaign = campaign._id;
    file.Client = client._id;

    file2.Name = "File 2";
    file2.Campaign = campaign._id;
    file2.Client = client._id;

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
      OriginalFile: file._id,
      Client: client._id
    });

    return Promise.all([
      user.save(),
      client.save(),
      campaign.save(),
      file.save(),
      file2.save(),
      header.save()
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
      mongoose.connection.collections.records.remove(),
      mongoose.connection.collections.headers.remove()
    ]).spread(function() {
      done();
    });
  });

  it("should return keys, values and the original object", function(done) {
    var flattener = Service.flattener(campaign);

    flattener.flatten().then(function(flat) {
      expect(flat).to.have.length(1);
      expect(flat[0].keys).to.exist;
      expect(flat[0].values).to.exist;
      expect(flat[0].headerObj).to.exist;
      done();
    });
  });

  it("should have the keys as the universal headers", function(done) {
    var flattener = Service.flattener(campaign);
    var expectedResult = [
      "CustKey",
      "HomePhone",
      "MobilePhone",
      "DOB",
      "Gender",
      "Title",
      "FirstName",
      "LastName",
      "Address1",
      "Suburb",
      "State",
      "Postcode",
      "Email",
      "SiteLabel",
      "Extra1"
    ];
    flattener
      .flatten()
      .then(function(flat) {
        expect(flat[0].keys).to.eql(expectedResult);

        done();
      })
      .catch(function(error) {
        console.log(error);
        done();
      });
  });

  it("should have the original as the values property", function(done) {
    var flattener = Service.flattener(campaign);
    var expectedResult = [
      "Consumer ID",
      "Home",
      "Mobile",
      "Date of Birth",
      "Sex",
      "Title",
      "First",
      "Last",
      "address",
      "City",
      "state",
      "zip",
      "email",
      "source",
      "domain"
    ];
    flattener
      .flatten()
      .then(function(flat) {
        expect(flat[0].values).to.eql(expectedResult);

        done();
      })
      .catch(function(error) {
        console.log(error);
        done();
      });
  });

  it("should have the header object as a the correct header", function(done) {
    var flattener = Service.flattener(campaign);

    flattener
      .flatten()
      .then(function(flat) {
        expect(flat[0].headerObj).to.have.property("_id");
        expect(flat[0].headerObj).to.have.property("OriginalFile");
        expect(flat[0].headerObj).to.have.property("Campaign");
        expect(flat[0].headerObj).to.have.property("Client");

        done();
      })
      .catch(function(error) {
        console.log(error);
        done();
      });
  });

  it("should return an empty array for a non existent campaign", function(
    done
  ) {
    var flattener = Service.flattener({});

    flattener
      .flatten()
      .then(function(flat) {
        expect(flat).to.eql([]);
        done();
      })
      .catch(function(error) {
        console.log(error);
        done();
      });
  });
});
