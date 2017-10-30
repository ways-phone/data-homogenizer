"use strict";

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var Promise = require("bluebird");
var expect = chai.expect;

var ListNameCreator = require("../services/create-list/ListNameCreator");

describe("ListNameCreator", function() {
  var config;
  before(function(done) {
    config = {
      client: {
        Acronym: "MSF"
      },
      campaign: {
        Name: "Lead Conversion"
      },
      count: 10,
      date: [2017, 5, 23]
    };
    done();
  });

  it("should create a name from only a file", function(done) {
    config.search = {
      File: {
        Name: "Test File"
      }
    };
    var name = ListNameCreator(config).create();
    expect(name).to.eq("MSF Lead Conversion_[Test File]_230617_(10)");

    done();
  });

  it("should create a name from only a Source", function(done) {
    config.search = {
      Source: {
        DisplayName: "Test Source - Stand Alone"
      }
    };
    var name = ListNameCreator(config).create();
    expect(name).to.eq(
      "MSF Lead Conversion_[Test Source - Stand Alone]_230617_(10)"
    );

    done();
  });

  it("should create a name from only a State", function(done) {
    config.search = {
      State: "NSW"
    };
    var name = ListNameCreator(config).create();
    expect(name).to.eq("MSF Lead Conversion_[NSW]_230617_(10)");

    done();
  });

  it("should create a name from only a Gender", function(done) {
    config.search = {
      Gender: "Female"
    };
    var name = ListNameCreator(config).create();
    expect(name).to.eq("MSF Lead Conversion_[Female]_230617_(10)");

    done();
  });

  it("should create a name from a File and Source", function(done) {
    config.search = {
      Source: {
        DisplayName: "Test Source - Stand Alone"
      },
      File: {
        Name: "Test File"
      }
    };
    var name = ListNameCreator(config).create();
    expect(name).to.eq(
      "MSF Lead Conversion_[Test Source - Stand Alone|Test File]_230617_(10)"
    );

    done();
  });

  it("should create a name from a File and State", function(done) {
    config.search = {
      State: "NSW",
      File: {
        Name: "Test File"
      }
    };
    var name = ListNameCreator(config).create();
    expect(name).to.eq("MSF Lead Conversion_[NSW|Test File]_230617_(10)");

    done();
  });

  it("should create a name from a File and Gender", function(done) {
    config.search = {
      Gender: "Female",
      File: {
        Name: "Test File"
      }
    };
    var name = ListNameCreator(config).create();
    expect(name).to.eq("MSF Lead Conversion_[Female|Test File]_230617_(10)");

    done();
  });

  it("should create a name from a Source and State", function(done) {
    config.search = {
      State: "NSW",
      Source: {
        DisplayName: "Test Source - Stand Alone"
      }
    };
    var name = ListNameCreator(config).create();
    expect(name).to.eq(
      "MSF Lead Conversion_[NSW|Test Source - Stand Alone]_230617_(10)"
    );

    done();
  });

  it("should create a name from a Source and Gender", function(done) {
    config.search = {
      Gender: "Female",
      Source: {
        DisplayName: "Test Source - Stand Alone"
      }
    };
    var name = ListNameCreator(config).create();
    expect(name).to.eq(
      "MSF Lead Conversion_[Female|Test Source - Stand Alone]_230617_(10)"
    );

    done();
  });

  it("should create a name from a State and Gender", function(done) {
    config.search = {
      Gender: "Female",
      State: "NSW"
    };
    var name = ListNameCreator(config).create();
    expect(name).to.eq("MSF Lead Conversion_[Female|NSW]_230617_(10)");

    done();
  });
});
