"use strict";

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var Promise = require("bluebird");
var expect = chai.expect;

var mongoose = require("mongoose");
var Campaign = mongoose.model("Campaign");
var List = mongoose.model("List");

var Creator = require("../services/add-dataset/DatasetCreator");

describe("Dataset Creator", function() {
  var list = new List();
  var campaign = new Campaign();
  var config;
  var creator;
  before(function() {
    list.Name = "Test List";
    list.Campaign = campaign._id;
    list.Count = 1;

    campaign.Name = "Test";
    campaign.Conversion = 0.04;
    campaign.ContactRate = 45;
    campaign.ContactSpaceID = 10;
    campaign.Lists = [list._id];

    return Promise.all([campaign.save(), list.save()]).spread(function(
      campaign,
      list
    ) {
      config = {
        campaign: campaign,
        lists: [list],
        name: "Test Dataset"
      };

      creator = Creator(config);
    });
  });

  after(function(done) {
    Promise.all([
      mongoose.connection.collections.campaigns.remove(),
      mongoose.connection.collections.lists.remove(),
      mongoose.connection.collections.csdatasets.remove()
    ]).spread(function() {
      done();
    });
  });

  it("should create a new Dataset with correct values", function(done) {
    creator
      .create()
      .then(function(results) {
        expect(results.dataset).to.exist;
        expect(results.dataset).to.have.property("Name", "Test Dataset");
        expect(results.dataset).to.have.property("ID");
        expect(results.dataset).to.have.property("isExported", false);
        expect(results.dataset)
          .to.have.property(List)
          .and.to.have.length(1);

        done();
      })
      .catch(function(error) {
        // console.log( error );
        done();
      });
  });

  it("should mark lists included in the dataset as exported ", function(done) {
    creator
      .create()
      .then(function(results) {
        expect(results.lists).to.exist;
        expect(results.lists).to.have.length(1);
        expect(results.lists[0]).to.have.property("Name", "Test List");
        expect(results.lists[0]).to.have.property("isExported", true);

        done();
      })
      .catch(function(error) {
        // console.log( error );
        done();
      });
  });
});
