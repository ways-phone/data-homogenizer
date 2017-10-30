"use strict";

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var Promise = require("bluebird");
var expect = chai.expect;
var mongoose = require("mongoose");
var sinon = require("sinon");
require("sinon-mongoose");
var CampaignsCtrl = require("../controllers/campaigns.server.controller");
var Campaign = mongoose.model("Campaign");
var Client = mongoose.model("Client");
var User = mongoose.model("User");
var Record = mongoose.model("Record");

describe("Campaigns Controller", function() {
  var res;
  var req;
  beforeEach(function() {
    req = {
      currentClient: new Client({
        Name: "count",
        Type: "Test",
        Acronym: "CCC"
      })
    };
    res = {
      json: sinon.spy()
    };
  });

  describe("Return record count", function() {
    after(function(done) {
      mongoose.connection.db.dropDatabase(function() {
        done();
      });
    });
    it("should return a client and associated record count", function(done) {
      var mock = sinon.mock(Record);
      mock.expects("count").resolves(10);

      CampaignsCtrl.returnRecordCount(req, res);
      setTimeout(function() {
        sinon.assert.calledWith(res.json, {
          data: {
            client: req.currentClient,
            count: 10
          }
        });
        mock.verify();
        mock.restore();
        done();
      });
    });

    it("should return an error to the browser on failure", function(done) {
      var mock = sinon.mock(Record);
      mock.expects("count").rejects("error");

      CampaignsCtrl.returnRecordCount(req, res);
      setTimeout(function() {
        sinon.assert.calledOnce(res.json);
        sinon.assert.calledWith(res.json, {
          error: Error("error")
        });
        mock.verify();
        mock.restore();
        done();
      }, 10);
    });

    it("should return an error when no currentClient", function(done) {
      CampaignsCtrl.returnRecordCount({}, res);
      setTimeout(function() {
        sinon.assert.calledOnce(res.json);
        sinon.assert.calledWith(res.json, {
          error: "Client no longer exists"
        });
        done();
      }, 10);
    });
  });

  describe("Get all campaigns", function() {
    it("should return all campaigns to browser", function(done) {
      var campaigns = [
        new Campaign({
          Name: "test1"
        }),
        new Campaign({
          Name: "test2"
        })
      ];
      var mock = sinon.mock(Campaign);
      mock
        .expects("find")
        .chain("populate")
        .withArgs("Client")
        .resolves(campaigns);

      CampaignsCtrl.getAllCampaigns(req, res);
      setTimeout(function() {
        sinon.assert.calledWith(res.json, {
          data: campaigns
        });
        mock.verify();
        mock.restore();
        done();
      }, 20);
    });

    it("should return an error to browser", function(done) {
      var mock = sinon.mock(Campaign);
      mock
        .expects("find")
        .chain("populate")
        .withArgs("Client")
        .rejects("error");

      CampaignsCtrl.getAllCampaigns(req, res);
      setTimeout(function() {
        sinon.assert.calledWith(res.json, {
          error: new Error("error")
        });
        mock.verify();
        mock.restore();
        done();
      }, 20);
    });
  });

  describe("Add campaign", function() {
    var client;
    var user;
    var campaign1;
    var res;
    var req;

    beforeEach(function() {
      user = new User({
        FirstName: "Miles",
        LastName: "Johnson",
        Department: "Data",
        Email: "j@j.com"
      });
      client = new Client({
        Name: "client",
        Type: "test",
        Acronym: "TEST",
        Creator: user._id
      });
      campaign1 = new Campaign({
        Name: "Test",
        Client: client._id,
        Creator: user._id,
        Conversion: 0.04,
        ContactRate: 45,
        ContactSpaceID: 10
      });
      req = {
        currentClient: client,
        body: {}
      };
      res = {
        json: sinon.spy()
      };
      return Promise.all([user.save(), client.save(), campaign1.save()]);
    });

    afterEach(function(done) {
      mongoose.connection.db.dropDatabase(function() {
        done();
      });
    });

    it("on success should add a new to the clients  campaigns", function(done) {
      var campaign = new Campaign({
        Name: "Test2",
        Client: client._id,
        Creator: user._id,
        Conversion: 0.04,
        ContactRate: 45,
        ContactSpaceID: 11
      });
      req.body.Campaign = campaign;
      CampaignsCtrl.addCampaign(req, res);
      setTimeout(function() {
        sinon.assert.calledOnce(res.json);

        return expect(Client.findOne({}))
          .to.eventually.have.property("Campaigns")
          .and.to.have.length(1)
          .notify(done);
      }, 40);
    });

    it("on success should add a campaign successfully", function(done) {
      var campaign = new Campaign({
        Name: "Test2",
        Client: client._id,
        Creator: user._id,
        Conversion: 0.04,
        ContactRate: 45,
        ContactSpaceID: 11
      });
      req.body.Campaign = campaign;
      CampaignsCtrl.addCampaign(req, res);
      setTimeout(function() {
        sinon.assert.calledOnce(res.json);
        expect(
          Campaign.findOne({
            _id: campaign._id
          })
        )
          .to.eventually.have.property("Name", "Test2")
          .notify(done);
      }, 10);
    });

    it("on fail should remove campaign from client", function(done) {
      var campaign = new Campaign({
        Name: "Test3",
        Client: client._id,
        Creator: user._id,
        Conversion: 44333,
        ContactRate: 45,
        ContactSpaceID: 12
      });
      req.body.Campaign = campaign;
      CampaignsCtrl.addCampaign(req, res);
      setTimeout(function() {
        sinon.assert.calledOnce(res.json);
        return expect(Client.findOne({}))
          .to.eventually.have.property("Campaigns")
          .and.to.have.length(0)
          .notify(done);
      }, 10);
    });

    it("on fail should return error", function(done) {
      var campaign = new Campaign({
        Name: "Test3",
        Client: client._id,
        Creator: user._id,
        Conversion: 44333,
        ContactRate: 45,
        ContactSpaceID: 12
      });
      req.body.Campaign = campaign;
      CampaignsCtrl.addCampaign(req, res);
      setTimeout(function() {
        sinon.assert.calledOnce(res.json);
        var first = res.json.getCalls()[0].args[0];
        expect(first.error).to.exist;
        expect(first.error).to.have.property(
          "message",
          "Campaign validation failed"
        );
        done();
      }, 10);
    });
  });

  describe("Update Campaign", function() {
    var client;
    var user;
    var campaign1;
    var res;
    var req;

    beforeEach(function(done) {
      user = new User({
        FirstName: "Miles",
        LastName: "Johnson",
        Department: "Data",
        Email: "j@j.com"
      });
      client = new Client({
        Name: "client",
        Type: "test",
        Acronym: "TEST",
        Creator: user._id
      });
      campaign1 = new Campaign({
        Name: "Test",
        Client: client._id,
        Creator: user._id,
        Conversion: 0.04,
        ContactRate: 45,
        ContactSpaceID: 10
      });
      req = {
        currentClient: client,
        body: {}
      };
      res = {
        json: sinon.spy()
      };
      user
        .save()
        .then(saveClient)
        .then(saveCampaign)
        .then(addCampaignToClient)
        .then(function() {
          done();
        })
        .catch(function(err) {
          console.log(err);
          done();
        });
      ////////////////////////////

      function saveCampaign() {
        return campaign1.save();
      }

      function saveClient() {
        return client.save();
      }

      function addCampaignToClient(campaign) {
        return Client.findOne({}).then(function(c) {
          c.Campaigns.push(campaign._id);
          return c.save();
        });
      }
    });

    afterEach(function(done) {
      mongoose.connection.db.dropDatabase(function() {
        done();
      });
    });
    it("should update campaign and return updated client", function(done) {
      var campaign = {
        Conversion: 0.2, // this is the field we have updated
        ContactRate: 45,
        ContactSpaceID: 10,
        _id: campaign1._id
      };

      req.body.Campaign = campaign;
      CampaignsCtrl.updateCampaign(req, res);
      setTimeout(function() {
        sinon.assert.calledOnce(res.json);
        var first = res.json.getCalls()[0].args[0];
        expect(first.data).to.exist;
        expect(first.data.Campaigns).to.have.length(1);
        expect(first.data.Campaigns[0]).to.have.property("Conversion", 0.2);
        done();
      }, 30);
    });
  });
});
