"use strict";

var request = require("supertest");
var express = require("../../../../config/express");
var mongoose = require("mongoose");
var Client = mongoose.model("Client");
var User = mongoose.model("User");
var app = express();

describe("GET /api/clients", function() {
  var user;
  var client;
  var client2;
  var token;
  beforeEach("create user", function() {
    user = new User({
      FirstName: "Test",
      LastName: "Testerson",
      Department: "Data",
      Email: "t@tsss.com"
    });
    token = user.generateJwt();
    return Promise.all([user.save()]);
  });
  afterEach("clear db", function(done) {
    mongoose.connection.db.dropDatabase(function() {
      done();
    });
  });
  it("should respond with json", function(done) {
    request(app)
      .get("/api/clients")
      .set("Authorization", "Bearer " + token)
      .then(function(err, res) {
        if (err) console.log(err);
        console.log(res);
        done();
      });
  });
});
