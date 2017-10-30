"use strict";

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

var expect = chai.expect;
// var should = chai.should(); var Mongoose = require('mongoose').Mongoose;
var config = require("../../config/mongoose");
var mongoose = config(true);
// var Mockgoose = require('mockgoose').Mockgoose; var mockgoose = new
// Mockgoose(mongoose);
var Campaign = require("../campaign/campaign.server.model");
var Client = require("../client/client.server.model");

after(function(done) {
  mongoose.connection.db.dropDatabase(function() {
    done();
  });
});

describe("Campaign Model", function() {
  after(function(done) {
    mongoose.connection.collections.campaigns.drop(function() {
      done();
    });
  });

  it("should fail validation if no ID included", function(done) {
    var campaign = new Campaign();
    campaign.validate(function(err) {
      expect(err.errors.ContactSpaceID).to.exist;
      done();
    });
  });

  it("should fail validation if no Name included", function(done) {
    var campaign = new Campaign();
    campaign.validate(function(err) {
      expect(err.errors.Name).to.exist;
      done();
    });
  });

  it("should fail validation if no Contact Rate included", function(done) {
    var campaign = new Campaign();
    campaign.validate(function(err) {
      expect(err.errors.ContactRate).to.exist;
      done();
    });
  });

  it("should fail validation if no Conversion included", function(done) {
    var campaign = new Campaign();
    campaign.validate(function(err) {
      expect(err.errors.Conversion).to.exist;
      done();
    });
  });

  it("should fail validation if conversion is less than 1", function(done) {
    var campaign = new Campaign();
    campaign.Conversion = -400;
    campaign.validate(function(err) {
      expect(err.errors.Conversion.message).to.eq(
        "Path `Conversion` (-4) is less than minimum allowed value (0)."
      );
      done();
    });
  });

  it("should fail validation if conversion is greater than 1", function(done) {
    var campaign = new Campaign();
    campaign.Conversion = 400;
    campaign.validate(function(err) {
      expect(err.errors.Conversion.message).to.eq(
        "Path `Conversion` (4) is more than maximum allowed value (1)."
      );
      done();
    });
  });

  it("should fail Save if duplicate ID entered", function() {
    var campaign = new Campaign();
    campaign.ContactSpaceID = 1;
    campaign.Name = "test1";
    campaign.ContactRate = 45;
    campaign.Conversion = 4.5;

    var campaign2 = new Campaign();
    campaign2.ContactSpaceID = 1;
    campaign2.Name = "test2";
    campaign2.ContactRate = 45;
    campaign2.Conversion = 4.5;

    return campaign.save().then(function(err, c) {
      return expect(campaign2.save())
        .to.eventually.be.rejectedWith(
          "E11000 duplicate key error collection: test.campaigns index: ContactSpaceID_1 du" +
            "p key: { : 1 }"
        )
        .and.be.an.instanceOf(Error)
        .and.have.property("code", 11000);
    });
  });

  it("should fail Save if duplicate Name entered", function() {
    var campaign = new Campaign();
    campaign.ContactSpaceID = 3;
    campaign.Name = "test1";
    campaign.ContactRate = 45;
    campaign.Conversion = 4.5;

    return expect(campaign.save())
      .to.eventually.be.rejectedWith(
        "E11000 duplicate key error collection: test.campaigns index: Name_1_Client_1 dup" +
          ' key: { : "Test1", : null }'
      )
      .and.be.an.instanceOf(Error)
      .and.have.property("code", 11000);
  });

  it("should pass set Path on Save", function() {
    var campaign = new Campaign();
    campaign.ContactSpaceID = 4;
    campaign.Name = "Lead Conversion";
    campaign.ContactRate = 45;
    campaign.Conversion = 4.5;
    return expect(campaign.save()).to.eventually.have.property(
      "Path",
      "Lead_Conversion"
    );
  });

  it("should Save Correctly if Name is same but client is different", function() {
    var client = new Client();
    var client2 = new Client();
    var campaign = new Campaign();
    campaign.Client = client;
    campaign.ContactSpaceID = 6;
    campaign.Name = "Lead Conversion";
    campaign.ContactRate = 45;
    campaign.Conversion = 4.5;

    var campaign2 = new Campaign();
    campaign2.Client = client2;
    campaign2.ContactSpaceID = 5;
    campaign2.Name = "Lead Conversion";
    campaign2.ContactRate = 45;
    campaign2.Conversion = 4.5;
    return campaign.save().then(function(err, c) {
      return expect(
        campaign2.save()
      ).to.eventually.be.fulfilled.and.to.have.property(
        "Path",
        "Lead_Conversion"
      );
    });
  });

  it("should Divide Conversion by 100 on save and multiply by 100 on get", function(
    done
  ) {
    var campaign = new Campaign();
    campaign.Conversion = 4.5;

    expect(campaign.Conversion).to.eq(4.5);
    done();
  });

  it("should Divide ContactRate by 100 on save and multiply by 100 on get", function(
    done
  ) {
    var campaign = new Campaign();
    campaign.ContactRate = 45;

    expect(campaign.ContactRate).to.eq(45);
    done();
  });

  it("should pass validation if all details entered", function(done) {
    var campaign = new Campaign();
    campaign.ContactSpaceID = 1;
    campaign.Name = "test1";
    campaign.ContactRate = 45;
    campaign.Conversion = 4.5;
    campaign.validate(function(err) {
      expect(err).to.not.exist;
      done();
    });
  });

  it("should format updated if a datestring is passed", function(done) {
    var campaign = new Campaign();
    campaign.Updated = "17/6/2017";
    expect(campaign.Updated).to.eq("17/06/2017");
    done();
  });
});
