"use strict";

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

var expect = chai.expect;
// var should = chai.should(); var Mongoose = require('mongoose').Mongoose;
var mongoose = require("mongoose");
// var Mockgoose = require('mockgoose').Mockgoose; var mockgoose = new
// Mockgoose(mongoose);
var User = require("../user/user.server.model");
var db;

beforeEach(function(done) {
  mongoose.connection.collections.users.drop(function() {
    done();
  });
});

after(function(done) {
  mongoose.connection.collections.users.drop(function() {
    done();
  });
});

describe("User Model", function() {
  it("Should fail if no First name is set", function(done) {
    var u = new User();
    u.validate(function(err) {
      expect(err.errors.FirstName).to.exist;
    });
    done();
  });

  it("Should fail if no Last name is set", function(done) {
    var u = new User();
    u.validate(function(err) {
      expect(err.errors.LastName).to.exist;
    });
    done();
  });

  it("Should fail if no Email is set", function(done) {
    var u = new User();
    u.validate(function(err) {
      expect(err.errors.Email).to.exist;
    });
    done();
  });

  it("Should fail if Department not in enum is set", function(done) {
    var u = new User();
    u.Department = "Test";
    u.validate(function(err) {
      expect(err.errors.Department).to.exist;
    });
    done();
  });

  it("Should be valid if FirstName, LastName, Email are set", function(done) {
    var u = new User();
    u.FirstName = "Miles";
    u.LastName = "Johnson";
    u.Department = "Data";

    u.validate(function(err) {
      expect(err).to.not.exist;
    });
    done();
  });

  it("Should create full name on save", function() {
    var u = new User();
    u.FirstName = "Miles";
    u.LastName = "Johnson";
    u.Department = "Data";
    u.Email = "test@test.com";

    return expect(u.save()).to.eventually.have.property(
      "FullName",
      "Miles Johnson"
    );
  });

  it("Can create hash and salt from a password", function() {
    var u = new User();
    u.FirstName = "Miles";
    u.LastName = "Johnson";
    u.Department = "Data";
    u.Email = "test@test.com";
    return u.save().then(function(user) {
      user.setPassword("123");
      expect(user.salt).to.exist;
      expect(user.hash).to.exist;
    });
  });

  it("Can correctly hash a password", function() {
    var u = new User();
    u.FirstName = "Miles";
    u.LastName = "Johnson";
    u.Department = "Data";
    u.Email = "test@test.com";
    return u.save().then(function(user) {
      user.setPassword("123");
      expect(user.validPassword("123"));
    });
  });

  it("Can generate a JSON Web Token", function() {
    var u = new User();
    u.FirstName = "Miles";
    u.LastName = "Johnson";
    u.Department = "Data";
    u.Email = "test@test.com";
    return u.save().then(confirmJWT);
    /////////////////

    function confirmJWT(user) {
      var jwt = user.generateJwt();
      expect(jwt.split(".").length).to.eq(3);
    }
  });
});
