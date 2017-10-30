"use strict";

var expect = require("chai").expect;

var Client = require("../client/client.server.model");
var User = require("../user/user.server.model");

describe("Client Model", function() {
  it("Should be invalid if no Creator", function(done) {
    var c = new Client();
    c.validate(function(err) {
      // console.log(err);
      expect(err.errors.Creator).to.exist;
      done();
    });
  });

  it("Should be invalid if no Name", function(done) {
    var c = new Client();
    c.validate(function(err) {
      // console.log(err);
      expect(err.errors.Name).to.exist;
      done();
    });
  });

  it("Should be invalid if no Type", function(done) {
    var c = new Client();
    c.validate(function(err) {
      // console.log(err);
      expect(err.errors.Type).to.exist;
      done();
    });
  });

  it("Should auto create dates", function(done) {
    var c = new Client();
    c.Created = new Date();
    expect(c.Created).to.exist;
    expect(c.Updated).to.exist;
    done();
  });

  it("Should be valid if Name, Acronym, Creator and Type are set", function(
    done
  ) {
    var c = new Client();
    c.Name = "Test";
    c.Acronym = "T";
    c.Type = "Humanitarian Aid";
    c.Creator = new User();
    c.validate(function(err) {
      expect(err).to.not.exist;
    });
    done();
  });

  it("Should format the Created Date on retrieval", function(done) {
    var c = new Client();
    c.Created = new Date(2017, 5, 6);
    expect(c.Created).to.eq("06/06/2017");
    done();
  });

  it("Should format the Updated Date on retrieval", function(done) {
    var c = new Client();
    c.Updated = new Date(2017, 5, 6);
    expect(c.Updated).to.eq("06/06/2017");
    done();
  });

  it("Name is capitalized when set", function(done) {
    var c = new Client();
    c.Name = "lowercase";
    expect(c.Name).to.eq("Lowercase");
    done();
  });
});
