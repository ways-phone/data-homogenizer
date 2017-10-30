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

describe("Header Comparer", function() {
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

  it("should return the correct object and properties for a match", function(
    done
  ) {
    var newHeader = [
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
    var comparer = Service.comparer(newHeader);
    var flattener = Service.flattener(campaign);
    comparer
      .findMatch(flattener.flatten())
      .then(function(result) {
        expect(result.header).to.exist;
        expect(result.header.header).to.exist;
        expect(result.match).to.exist;
        expect(result.header.isMatch).to.exist;
        expect(result.header.headerObj).to.exist;
        done();
      })
      .catch(function(error) {
        console.log(error);
      });
  });

  it("for a a matching header, should set match to be true", function(done) {
    var newHeader = [
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
    var comparer = Service.comparer(newHeader);
    var flattener = Service.flattener(campaign);
    comparer
      .findMatch(flattener.flatten())
      .then(function(result) {
        expect(result.header.isMatch).to.be.true;
        done();
      })
      .catch(function(error) {
        console.log(error);
      });
  });

  it("for a a matching header, return the matching headerObj", function(done) {
    var newHeader = [
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
    var comparer = Service.comparer(newHeader);
    var flattener = Service.flattener(campaign);
    comparer
      .findMatch(flattener.flatten())
      .then(function(result) {
        expect(result.header.headerObj).to.have.property("Campaign");
        done();
      })
      .catch(function(error) {
        console.log(error);
      });
  });

  it("for a a matching header, return the mapped header", function(done) {
    var newHeader = [
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
    var match = [
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
    var comparer = Service.comparer(newHeader);
    var flattener = Service.flattener(campaign);
    comparer
      .findMatch(flattener.flatten())
      .then(function(result) {
        expect(result.header.header).to.eql(match);
        done();
      })
      .catch(function(error) {
        console.log(error);
      });
  });

  it("should return the correct object and properties for a header that doesnt match", function(
    done
  ) {
    var newHeader = [
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
      "domainsss"
    ];
    var comparer = Service.comparer(newHeader);
    var flattener = Service.flattener(campaign);
    comparer
      .findMatch(flattener.flatten())
      .then(function(result) {
        expect(result.header).to.exist;
        expect(result.header.header).to.exist;
        expect(result.match).to.exist;
        expect(result.header.isMatch).to.exist;
        expect(result.header.headerObj).to.exist;
        done();
      })
      .catch(function(error) {
        console.log(error);
      });
  });

  it("for a header that doesnt match, should set match to be false", function(
    done
  ) {
    var newHeader = [
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
      "domainsss"
    ];
    var comparer = Service.comparer(newHeader);
    var flattener = Service.flattener(campaign);
    comparer
      .findMatch(flattener.flatten())
      .then(function(result) {
        expect(result.header.isMatch).to.be.false;
        expect(result.match).to.be.false;
        done();
      })
      .catch(function(error) {
        console.log(error);
      });
  });

  it("for a header that doesnt match, should return the original header", function(
    done
  ) {
    var newHeader = [
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
      "domainsss"
    ];
    var comparer = Service.comparer(newHeader);
    var flattener = Service.flattener(campaign);
    comparer
      .findMatch(flattener.flatten())
      .then(function(result) {
        expect(result.header.header).to.eql(newHeader);
        done();
      })
      .catch(function(error) {
        console.log(error);
      });
  });

  it("for a header that doesnt match, should have header object as empty", function(
    done
  ) {
    var newHeader = [
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
      "domainsss"
    ];
    var comparer = Service.comparer(newHeader);
    var flattener = Service.flattener(campaign);
    comparer
      .findMatch(flattener.flatten())
      .then(function(result) {
        expect(result.header.headerObj).to.eql({});
        done();
      })
      .catch(function(error) {
        console.log(error);
      });
  });

  it("for an empty header should contain the right properties on the return", function(
    done
  ) {
    var newHeader = [];

    var comparer = Service.comparer(newHeader);
    var flattener = Service.flattener(campaign);
    comparer
      .findMatch(flattener.flatten())
      .then(function(result) {
        expect(result.header).to.exist;
        expect(result.header.header).to.exist;
        expect(result.match).to.exist;
        expect(result.header.isMatch).to.exist;
        expect(result.header.headerObj).to.exist;
        done();
      })
      .catch(function(error) {
        console.log(error);
      });
  });

  it("for a non array header should return the correct obj and properties", function(
    done
  ) {
    var newHeader = "asdasd";

    var comparer = Service.comparer(newHeader);
    var flattener = Service.flattener(campaign);
    comparer
      .findMatch(flattener.flatten())
      .then(function(result) {
        expect(result.header).to.exist;
        expect(result.header.header).to.exist;
        expect(result.match).to.exist;
        expect(result.header.isMatch).to.exist;
        expect(result.header.headerObj).to.exist;
        done();
      })
      .catch(function(error) {
        console.log(error);
      });
  });
});
