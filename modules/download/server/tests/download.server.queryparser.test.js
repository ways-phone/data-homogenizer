"use strict";

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var Promise = require("bluebird");
var expect = chai.expect;
var parser = require("../services/index").queryParser;

describe("Download Query Parser", function() {
  var fileQ;
  var listQ;
  var campaignQ;
  var sourceQ;
  before(function(done) {
    fileQ = {
      File: "File_ID",
      isInvalid: false
    };
    done();
  });

  it("for a clean file download should return the file id and duplicate query should be false", function(
    done
  ) {
    var config = parser.parse(fileQ);

    expect(config.query).to.exist;
    expect(config.dupeQuery).to.exist;
    expect(config.query).to.have.property("File", "File_ID");
    expect(config.query).to.have.property("isInvalid", false);
    expect(config.dupeQuery).to.have.property("isDuplicate", false);
    expect(config.dupeQuery).to.have.property("isDuplicateWithinFile", false);
    expect(config.dupeQuery).to.not.have.property("isInvalid");
    done();
  });

  it("for an all file download, should create the appropriate duplicate Query", function(
    done
  ) {
    var fileQ = {
      File: "File_ID",
      $or: {
        isDuplicate: true,
        isDuplicateWithinFile: true
      }
    };
    var config = parser.parse(fileQ);
    expect(config.query).to.exist;
    expect(config.dupeQuery).to.exist;
    expect(config.query).to.have.property("File", "File_ID");
    expect(config.dupeQuery).to.have.property("File", "File_ID");
    done();
  });
  it("should handle a clean list download", function(done) {
    var listQ = {
      List: "List_ID",
      isInvalid: false
    };
    var config = parser.parse(listQ);
    expect(config.query).to.exist;
    expect(config.dupeQuery).to.exist;
    expect(config.query).to.have.property("List", "List_ID");
    expect(config.query).to.have.property("isInvalid", false);
    expect(config.dupeQuery).to.have.property("isDuplicate", false);
    expect(config.dupeQuery).to.have.property("isDuplicateWithinFile", false);
    expect(config.dupeQuery).to.not.have.property("isInvalid");
    done();
  });

  it("should handle a all list download", function(done) {
    var listQ = {
      List: "List_ID",
      $or: {
        isDuplicate: true,
        isDuplicateWithinFile: true
      }
    };
    var config = parser.parse(listQ);
    expect(config.query).to.exist;
    expect(config.dupeQuery).to.exist;
    expect(config.query).to.have.property("List", "List_ID");
    expect(config.dupeQuery).to.have.property("List", "List_ID");
    done();
  });

  it("should handle a clean campaign download and parse date range", function(
    done
  ) {
    var campaignQ = {
      Campaign: "Campaign_ID",
      Created:
        '{ "$gte": "2017-06-21T14:00:00.000Z", "$lt": "2017-06-22T13:59:59.059Z" }',
      isInvalid: false
    };
    var config = parser.parse(campaignQ);
    expect(config.query).to.exist;
    expect(config.dupeQuery).to.exist;
    expect(config.query).to.have.property("Campaign", "Campaign_ID");
    expect(config.query).to.have.property("isInvalid", false);
    expect(config.query.Created).to.have.property(
      "$gte",
      "2017-06-21T14:00:00.000Z"
    );
    expect(config.query.Created).to.have.property(
      "$lt",
      "2017-06-22T13:59:59.059Z"
    );
    expect(config.dupeQuery).to.have.property("isDuplicate", false);
    expect(config.dupeQuery).to.have.property("isDuplicateWithinFile", false);
    expect(config.dupeQuery).to.not.have.property("isInvalid");
    done();
  });

  it("should handle an all campaign download and parse date range", function(
    done
  ) {
    var campaignQ = {
      Campaign: "Campaign_ID",
      Created:
        '{ "$gte": "2017-06-21T14:00:00.000Z", "$lt": "2017-06-22T13:59:59.059Z" }',
      $or: {
        isDuplicate: true,
        isDuplicateWithinFile: true
      }
    };
    var config = parser.parse(campaignQ);

    expect(config.query).to.exist;
    expect(config.dupeQuery).to.exist;
    expect(config.query).to.have.property("Campaign", "Campaign_ID");
    expect(config.query.Created).to.have.property(
      "$gte",
      "2017-06-21T14:00:00.000Z"
    );
    expect(config.query.Created).to.have.property(
      "$lt",
      "2017-06-22T13:59:59.059Z"
    );
    expect(config.dupeQuery).to.have.property("Campaign", "Campaign_ID");
    expect(config.dupeQuery.Created).to.have.property(
      "$gte",
      "2017-06-21T14:00:00.000Z"
    );
    expect(config.dupeQuery.Created).to.have.property(
      "$lt",
      "2017-06-22T13:59:59.059Z"
    );
    done();
  });

  it("should handle a clean source download and parse date range", function(
    done
  ) {
    var campaignQ = {
      Source: "Source_ID",
      Created:
        '{ "$gte": "2017-06-21T14:00:00.000Z", "$lt": "2017-06-22T13:59:59.059Z" }',
      isInvalid: false
    };
    var config = parser.parse(campaignQ);

    expect(config.query).to.exist;
    expect(config.dupeQuery).to.exist;
    expect(config.query).to.have.property("Source", "Source_ID");
    expect(config.query).to.have.property("isInvalid", false);
    expect(config.query.Created).to.have.property(
      "$gte",
      "2017-06-21T14:00:00.000Z"
    );
    expect(config.query.Created).to.have.property(
      "$lt",
      "2017-06-22T13:59:59.059Z"
    );
    expect(config.dupeQuery).to.have.property("isDuplicate", false);
    expect(config.dupeQuery).to.have.property("isDuplicateWithinFile", false);
    expect(config.dupeQuery).to.not.have.property("isInvalid");
    done();
  });

  it("should handle an all source download and parse date range", function(
    done
  ) {
    var campaignQ = {
      Source: "Source_ID",
      Created:
        '{ "$gte": "2017-06-21T14:00:00.000Z", "$lt": "2017-06-22T13:59:59.059Z" }',
      $or: {
        isDuplicate: true,
        isDuplicateWithinFile: true
      }
    };
    var config = parser.parse(campaignQ);

    expect(config.query).to.exist;
    expect(config.dupeQuery).to.exist;
    expect(config.query).to.have.property("Source", "Source_ID");
    expect(config.query.Created).to.have.property(
      "$gte",
      "2017-06-21T14:00:00.000Z"
    );
    expect(config.query.Created).to.have.property(
      "$lt",
      "2017-06-22T13:59:59.059Z"
    );
    expect(config.dupeQuery).to.have.property("Source", "Source_ID");
    expect(config.dupeQuery.Created).to.have.property(
      "$gte",
      "2017-06-21T14:00:00.000Z"
    );
    expect(config.dupeQuery.Created).to.have.property(
      "$lt",
      "2017-06-22T13:59:59.059Z"
    );
    done();
  });
});
