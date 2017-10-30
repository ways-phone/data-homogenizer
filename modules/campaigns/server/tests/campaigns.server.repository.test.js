"use strict";

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var Promise = require("bluebird");
var expect = chai.expect;
var mongoose = require("mongoose");

var Client = mongoose.model("Client");
var User = mongoose.model("User");
var Campaign = mongoose.model("Campaign");
var Repo = require("../repository/campaigns.server.repository");
var Promise = require("bluebird");

describe("Campaigns Repository", function() {
  var user;
  var client;
  var client2;
  var campaign1;
  var campaign2;
  beforeEach("create user", function() {
    user = new User({
      FirstName: "Test",
      LastName: "Testerson",
      Department: "Data",
      Email: "t@tsss.com"
    });
    client = new Client({
      Name: "Test5",
      Acronym: "TTT",
      Type: "test",
      Creator: user._id,
      Campaigns: [campaign1]
    });

    client2 = new Client({
      Name: "Test2",
      Acronym: "TTS",
      Type: "test",
      Creator: user._id,
      Campaigns: [campaign2]
    });

    campaign1 = new Campaign({
      Name: "Test",
      Client: client._id,
      Creator: user._id,
      Conversion: 0.04,
      ContactRate: 45,
      ContactSpaceID: 10
    });

    campaign2 = new Campaign({
      Name: "Test2",
      Client: client2._id,
      Creator: user._id,
      Conversion: 0.04,
      ContactRate: 45,
      ContactSpaceID: 12
    });
    return Promise.all([
      user.save(),
      client.save(),
      client2.save(),
      campaign1.save(),
      campaign2.save()
    ]);
  });
  afterEach("clear db", function(done) {
    mongoose.connection.collections.campaigns.drop(function() {
      mongoose.connection.collections.clients.drop(function() {
        mongoose.connection.collections.users.drop(function() {
          done();
        });
      });
    });
  });

  it("Should return all campaigns regardless of client", function() {
    return Promise.all([
      expect(Repo.get()).to.eventually.be.fulfilled,
      expect(Repo.get()).to.eventually.have.length(2)
    ]);
  });

  it("Should return both client and count when retrieving the record count", function() {
    return Promise.all([
      expect(Repo.recordCount(client)).to.eventually.have.property("count", 0),
      expect(Repo.recordCount(client)).to.eventually.have.property("client")
    ]);
  });

  describe("Adding a Campaign", function() {
    var newCampaign;
    beforeEach(function(done) {
      newCampaign = {
        Name: "Test3",
        Client: client._id,
        Creator: user._id,
        Conversion: 0.04,
        ContactRate: 45,
        ContactSpaceID: 33
      };
      done();
    });
    it("should sucessfully add a campaign and return client with the campaign added", function() {
      return Promise.all([
        expect(Repo.add(newCampaign)).to.eventually.be.fulfilled,
        expect(Repo.add(newCampaign)).to.eventually.have.property("Campaigns")
      ]);
    });

    it("should successfully add a campaign and populate the campaigns creator", function() {
      return Repo.add(newCampaign).then(function(client) {
        var added = client.Campaigns.filter(function(campaign) {
          return campaign.Name === "Test3";
        })[0];
        return expect(added.Creator).to.have.property(
          "FullName",
          "Test Testerson"
        );
      });
    });

    it("Should successfully add a campaign and add it to the clients list of campaigns", function() {
      return Repo.add(newCampaign).then(function(client) {
        var added = client.Campaigns.filter(function(campaign) {
          return campaign.Name === "Test3";
        });
        return expect(added).to.have.length(1);
      });
    });
  });

  describe("Updating a Campaign", function() {
    var newCampaign;
    beforeEach(function() {
      var c = {
        Name: "Test3",
        Client: client._id,
        Creator: user._id,
        Conversion: 4,
        ContactRate: 45,
        ContactSpaceID: 33,
        Created: "20/02/2017"
      };
      return Repo.add(c).then(function(client) {
        newCampaign = client.Campaigns[0];
      });
    });

    it("should update only the keys in the update", function() {
      var update = {
        _id: newCampaign._id,
        Client: client._id,
        Name: "This is Miles"
      };

      return Repo.update(update).then(function(client) {
        var updated = client.Campaigns.filter(function(campaign) {
          return campaign.Name === "This Is Miles";
        });
        return Promise.all([
          expect(updated).to.have.length(1),
          expect(updated[0]).to.have.property("ContactRate", 45),
          expect(updated[0]).to.have.property("Conversion", 4),
          expect(updated[0]).to.have.property("ContactSpaceID", 33)
        ]);
      });
    });

    it("on update, created and updated time should be different", function() {
      var update = {
        _id: newCampaign._id,
        Client: client._id,
        Name: "This is Miles"
      };

      return Repo.update(update).then(function(client) {
        var updated = client.Campaigns.filter(function(campaign) {
          return campaign.Name === "This Is Miles";
        })[0];
        return expect(updated.Created).to.not.eq(updated.Updated);
      });
    });

    it("should return fully populated client after campaign update", function() {
      var update = {
        _id: newCampaign._id,
        Client: client._id,
        Name: "This is Miles"
      };
      return Repo.update(update).then(function(client) {
        return Promise.all([
          expect(client.Campaigns[0])
            .to.have.property("Creator")
            .and.to.have.property("FullName", "Test Testerson"),
          expect(client)
            .to.have.property("Creator")
            .and.to.have.property("FullName", "Test Testerson")
        ]);
      });
    });

    it("should reject the promise if the update is invalid", function() {
      var update = {
        _id: newCampaign._id,
        Client: client._id,
        Name: "This is Miles",
        Conversion: 300000
      };
      return expect(Repo.update(update)).to.be.rejected;
    });
  });
});
