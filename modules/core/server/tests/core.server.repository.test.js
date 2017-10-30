"use strict";

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var Promise = require("bluebird");
var expect = chai.expect;
var mongoose = require("mongoose");

var Client = mongoose.model("Client");
var User = mongoose.model("User");
var Repo = require("../repository/core.server.repository");
var Promise = require("bluebird");

describe("Core Repository", function() {
  var user;
  var client;
  var client2;
  beforeEach("create user", function() {
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
      Creator: user._id
    });

    client2 = new Client({
      Name: "Test2",
      Acronym: "TTS",
      Type: "test",
      Creator: user._id
    });
    return Promise.all([user.save(), client.save(), client2.save()]);
  });
  afterEach("clear db", function(done) {
    mongoose.connection.collections.users.drop(function() {
      mongoose.connection.collections.clients.drop(function() {
        done();
      });
    });
  });

  it("should retrieve all clients", function() {
    return expect(Repo.get()).to.eventually.have.length(2);
  });

  it("should populate creator full name", function() {
    return Repo.get().then(function(clients) {
      expect(clients[0]).to.have.property("Creator");
      expect(clients[0].Creator).to.have.property("FullName", "Test Testerson");
    });
  });

  it("should add new client successfully and return populated model", function() {
    var newClient = {
      Name: "Add Test",
      Acronym: "ADD",
      Type: "test",
      Creator: user._id
    };

    return Promise.all([
      expect(Repo.add(newClient)).to.eventually.have.property(
        "Name",
        "Add Test"
      ),
      expect(Repo.add(newClient)).to.eventually.have.property("Creator"),
      expect(Repo.add(newClient))
        .to.eventually.have.property("Creator")
        .and.to.have.property("FullName", "Test Testerson")
    ]);
  });

  it("should handle adding an invalid client and reject the promise", function() {
    var newClient = {
      Name: "Add Test",
      Acronym: "ADD",
      Creator: user._id
    };
    return expect(Repo.add(newClient)).to.eventually.be.rejected;
  });

  it("should return the removed client", function() {
    return expect(Repo.remove(client._id)).to.eventually.have.property(
      "Name",
      "Test1"
    );
  });

  it("should remove the client from the Clients Collection", function() {
    return Repo.remove(client._id).then(function() {
      return expect(Repo.get()).to.eventually.have.length(1);
    });
  });

  it("should sucessfully update client", function() {
    var update = {
      Name: "Update",
      _id: client._id
    };

    return expect(Repo.update(update)).to.eventually.have.property(
      "Name",
      "Update"
    );
  });

  it("should sucessfully update client and populate return doc", function() {
    var update = {
      Name: "update populate",
      _id: client2._id
    };

    return expect(Repo.update(update))
      .to.eventually.have.property("Creator")
      .and.to.have.property("FullName", "Test Testerson");
  });

  it("Should reject the promise for an invalid update", function() {
    var update = {
      Name: undefined,
      _id: client2._id
    };

    return expect(Repo.update(update)).to.eventually.be.rejected;
  });
});
