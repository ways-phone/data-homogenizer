"use strict";

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var Promise = require("bluebird");
var expect = chai.expect;
var mongoose = require("mongoose");
var sinon = require("sinon");
require("sinon-mongoose");
var ClientRoutes = require("../routes/core.server.routes");
var ClientCtrl = require("../controllers/core.server.controller");
var Client = mongoose.model("Client");
var User = mongoose.model("User");

describe("Core Controller", function() {
  var client1 = new Client();
  var client2 = new Client();
  var expectedClients = [client1, client2];
  var res;
  var req;
  beforeEach(function() {
    req = {};
    res = {
      json: sinon.spy()
    };
    this.user = new User({
      FirstName: "Miles",
      LastName: "Johnson",
      Department: "Data",
      Email: "j@j.com"
    });
    return this.user.save();
  });

  afterEach(function(done) {
    mongoose.connection.db.dropDatabase(function() {
      done();
    });
  });
  describe("Retrieve Clients", function() {
    it("Should retrieve and send all clients", function(done) {
      var mock = sinon.mock(Client);
      mock
        .expects("find")
        .chain("deepPopulate")
        .withArgs(
          "Campaigns Campaigns.Sources Campaigns.Files Campaigns.Lists Creator.FullName"
        )
        .chain("sort")
        .withArgs("Name")
        .resolves(expectedClients);

      ClientCtrl.returnClients(req, res);
      setTimeout(function() {
        sinon.assert.calledWith(res.json, {
          data: expectedClients
        });
        mock.verify();
        mock.restore();
        done();
      });
    });

    it("Should return an error on failure", function(done) {
      var mock = sinon.mock(Client);
      mock
        .expects("find")
        .chain("deepPopulate")
        .withArgs(
          "Campaigns Campaigns.Sources Campaigns.Files Campaigns.Lists Creator.FullName"
        )
        .chain("sort")
        .withArgs("Name")
        .rejects("Something went wrong");

      ClientCtrl.returnClients(req, res);
      setTimeout(function() {
        sinon.assert.calledWith(res.json, {
          error: new Error("Something went wrong")
        });
        mock.verify();
        mock.restore();
        done();
      });
    });
  });
  describe("Add Client", function() {
    it("Should save a valid client from req.body and return it", function(
      done
    ) {
      var client = {
        Name: "Add",
        Type: "Humanitarian Aid",
        Creator: this.user
      };

      req = {
        body: client
      };

      ClientCtrl.addClient(req, res);
      setTimeout(function() {
        client.Creator = {
          _id: client.Creator._id,
          FullName: "Miles Johnson"
        };
        sinon.assert.calledOnce(res.json);
        var first = res.json.getCalls()[0].args[0].data;
        // console.log(first);
        expect(first.Creator).to.have.property("FullName", "Miles Johnson");
        expect(first).to.have.property("Name", "Add");
        expect(first).to.have.property("Type", "Humanitarian Aid");
        expect(first.Created).to.exist;
        expect(first.Updated).to.exist;
        expect(first._id).to.exist;
        done();
      }, 40);
    });

    it("should return an error message form trying to add client that already exists", function(
      done
    ) {
      var client = {
        Name: "Invalid",
        Type: "Humanitarian Aid"
      };

      req = {
        body: client
      };

      ClientCtrl.addClient(req, res);
      setTimeout(function() {
        sinon.assert.calledOnce(res.json);

        var first = res.json.getCalls()[0].args[0];
        expect(first.error).to.exist;
        expect(first.error).to.have.property(
          "message",
          "Client validation failed"
        );
        expect(first.error.errors.Creator).to.have.property(
          "message",
          "Path `Creator` is required."
        );
        done();
      }, 20);
    });
  });

  describe("Remove Client", function() {
    it("should remove a client and return removed client", function(done) {
      var client = new Client({
        Name: "remove",
        Type: "Humanitarian Aid",
        Acronym: "TTT",
        Creator: this.user
      });
      client.save().then(function(saved) {
        req = {
          query: client._id
        };
        res = {
          json: sinon.stub()
        };

        ClientCtrl.removeClient(req, res);

        setTimeout(function() {
          sinon.assert.calledOnce(res.json);
          var first = res.json.getCalls()[0].args[0].data;
          expect(first.Name).to.eq("Remove");
          expect(first.Creator).to.exist;
          done();
        }, 10);
      });
    });

    it("should return an error on removal failure", function(done) {
      var client = new Client({
        Name: "fail",
        Type: "Humanitarian Aid",
        Acronym: "FFF",
        Creator: this.user
      });
      client.save().then(function(saved) {
        req = {
          query: "ASDASD"
        };
        res = {
          json: sinon.stub()
        };

        ClientCtrl.removeClient(req, res);

        setTimeout(function() {
          sinon.assert.calledOnce(res.json);
          var first = res.json.getCalls()[0].args[0];
          expect(first.error).to.exist;
          expect(first.error).to.have.property(
            "message",
            'Cast to ObjectId failed for value "ASDASD" at path "_id" for model "Client"'
          );

          done();
        }, 20);
      });
    });
  });
  describe("Update Client", function() {
    it("should Update a client and return the updated client", function(done) {
      var client = new Client({
        Name: "update",
        Type: "Humanitarian Aid",
        Acronym: "UU",
        Creator: this.user
      });
      client.save().then(function(saved) {
        req = {
          body: {
            _id: client._id,
            Name: "updated",
            Type: "Humanitarian Aid"
          }
        };
        res = {
          json: sinon.stub()
        };

        ClientCtrl.updateClient(req, res);

        setTimeout(function() {
          sinon.assert.calledOnce(res.json);
          var first = res.json.getCalls()[0].args[0].data;
          expect(first).to.exist;
          expect(first).to.have.property("Name", "Updated");
          done();
        }, 10);
      });
    });

    it("Update Failure should return error", function(done) {
      var client = new Client({
        Name: "update",
        Type: "Humanitarian Aid",
        Acronym: "UU",
        Creator: this.user
      });
      client.save().then(function(saved) {
        req = {
          body: {
            _id: "ASDASD",
            Name: "updated",
            Type: "Humanitarian Aid"
          }
        };
        res = {
          json: sinon.stub()
        };

        ClientCtrl.updateClient(req, res);

        setTimeout(function() {
          sinon.assert.calledOnce(res.json);
          var first = res.json.getCalls()[0].args[0];
          expect(first.error).to.exist;
          expect(first.error).to.have.property(
            "message",
            'Cast to ObjectId failed for value "ASDASD" at path "_id" for model "Client"'
          );
          done();
        }, 10);
      });
    });
  });
});
