"use strict";

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var Promise = require("bluebird");
var expect = chai.expect;

var mongoose = require("mongoose");
var Campaign = mongoose.model("Campaign");
var List = mongoose.model("List");
var Source = mongoose.model("Source");
var Client = mongoose.model("Client");
var User = mongoose.model("User");
var File = mongoose.model("File");
var Record = mongoose.model("Record");
var CsDataset = mongoose.model("CsDataset");

var ListDataRetriever = require("../services/create-list/ListDataRetriever");

describe("List Data Retriever", function() {
  var record;
  var record2;
  var record3;
  var record4;
  var source = new Source();
  var source2 = new Source();
  var file = new File();
  var list = new List();
  var list2 = new List();
  var file2 = new File();
  var newList;
  var client;
  var campaign;
  var user;
  var dataset;
  var config;

  before(function() {
    if (mongoose.connection) {
      mongoose.connection.close(function() {
        var config = require("../../../../config/mongoose");
        mongoose = config(true);
      });
    }
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
      Creator: user._id,
      Campaigns: [campaign]
    });

    campaign = new Campaign({
      Name: "Test",
      Client: client._id,
      Creator: user._id,
      Conversion: 0.04,
      ContactRate: 45,
      ContactSpaceID: 10,
      Files: [file._id, file2._id],
      Lists: [list._id, list2._id],
      Sources: [source._id, source2._id]
    });

    file.Name = "File 1";
    file.Campaign = campaign._id;
    file.Client = client._id;

    file2.Name = "File 2";
    file2.Campaign = campaign._id;
    file2.Client = client._id;

    list.Name = "List 1";
    list.Campaign = campaign._id;
    list.Count = 1;

    list2.Name = "List 2";
    list2.Campaign = campaign._id;
    list2.Count = 1;

    source.Name = "8th Floor";
    source.Type = "Stand Alone";
    source.Campaign = campaign._id;
    source.Cost = 4.5;
    source.Provider = "TPS";

    source2.Name = "Cohort";
    source2.Type = "Stand Alone";
    source2.Campaign = campaign._id;
    source2.Cost = 4.5;
    source2.Provider = "TPS";

    dataset = new CsDataset({
      Name: "Test Dataset",
      ID: 4,
      Campaign: campaign._id,
      List: [list._id]
    });

    record = new Record({
      FirstName: "Test",
      LastName: "Testerson",
      File: file._id,
      Source: source._id,
      List: list._id,
      Campaign: campaign._id,
      Client: client._id,
      MobilePhone: "498092179",
      Title: "Mr",
      Address1: "22 Test St",
      Suburb: "Testington",
      State: "NSW",
      Postcode: "2000",
      DOB: "27/09/1991",
      Timestamp: "06/06/2017"
    });

    record2 = new Record({
      FirstName: "Second File",
      LastName: "Testerson",
      File: file._id,
      Source: source2._id,
      Campaign: campaign._id,
      Client: client._id,
      MobilePhone: "498092179",
      Title: "Mr",
      Address1: "22 Test St",
      Suburb: "Testington",
      State: "NSW",
      Postcode: "2000",
      DOB: "27/09/1991",
      Timestamp: "06/06/2017"
    });

    record3 = new Record({
      FirstName: "Third File",
      LastName: "Testerson",
      File: file._id,
      Source: source2._id,
      Campaign: campaign._id,
      Client: client._id,
      MobilePhone: "498092178",
      Title: "Mr",
      Address1: "22 Test St",
      Suburb: "Testington",
      State: "NSW",
      Postcode: "2000",
      DOB: "27/09/1991",
      Timestamp: "06/06/2017"
    });

    record4 = new Record({
      FirstName: "Fourth File",
      LastName: "Testerson",
      File: file2._id,
      Source: source2._id,
      Campaign: campaign._id,
      Client: client._id,
      MobilePhone: "498092168",
      Title: "Mr",
      Address1: "22 Test St",
      Suburb: "Testington",
      State: "NSW",
      Postcode: "2000",
      DOB: "27/09/1991",
      Timestamp: "06/06/2017"
    });
    config = {
      client: client,
      campaign: campaign,
      count: 10,
      date: [2017, 5, 23]
    };

    return Promise.all([
      user.save(),
      client.save(),
      campaign.save(),
      file.save(),
      file2.save(),
      source.save(),
      source2.save(),
      list.save(),
      list2.save(),
      dataset.save(),
      record3.save(),
      record4.save(),
      record.save().then(function() {
        return record2.save().catch(function() {});
      })
    ]);
  });

  after(function(done) {
    Promise.all([
      mongoose.connection.collections.campaigns.remove(),
      mongoose.connection.collections.lists.remove(),
      mongoose.connection.collections.csdatasets.remove(),
      mongoose.connection.collections.files.remove(),
      mongoose.connection.collections.sources.remove(),
      mongoose.connection.collections.clients.remove(),
      mongoose.connection.collections.users.remove(),
      mongoose.connection.collections.records.remove()
    ]).spread(function() {
      done();
    });
  });

  it("should return an object with the unique sources, files and records", function(
    done
  ) {
    config.search = {
      Gender: "Male"
    };

    ListDataRetriever(config)
      .retrieve()
      .then(function(results) {
        expect(results.sources).to.exist.and.to.be.a("Array");
        expect(results.files).to.exist.and.to.be.a("Array");
        expect(results.records).to.exist.and.to.be.a("Array");
        done();
      });
  });

  it("when the search is file 1 should return 2 records, 2 sources", function(
    done
  ) {
    config.search = {
      File: file._id
    };
    ListDataRetriever(config)
      .retrieve()
      .then(function(results) {
        expect(results.sources).to.have.length(2);
        expect(results.files).to.have.length(1);
        expect(results.records).to.have.length(2);
        done();
      })
      .catch(function(err) {
        console.log(err);
        done();
      });
  });

  it("when the search is file 1 sources returned should be 8th floor and cohort", function(
    done
  ) {
    config.search = {
      File: file._id
    };
    ListDataRetriever(config)
      .retrieve()
      .then(function(results) {
        expect(results.sources).to.have.length(2);
        expect(results.sources[0]).to.have.property(
          "DisplayName",
          "Cohort - Stand Alone"
        );
        expect(results.sources[1]).to.have.property(
          "DisplayName",
          "8th Floor - Stand Alone"
        );
        done();
      })
      .catch(function(err) {
        console.log(err);
        done();
      });
  });

  it("when the search is file 2 should return 1 record, 1 sources", function(
    done
  ) {
    config.search = {
      File: file2._id
    };
    ListDataRetriever(config)
      .retrieve()
      .then(function(results) {
        expect(results.sources).to.have.length(1);
        expect(results.files).to.have.length(1);
        expect(results.records).to.have.length(1);
        done();
      })
      .catch(function(err) {
        console.log(err);
        done();
      });
  });

  it("when the search is file 2 returned source should be cohort", function(
    done
  ) {
    config.search = {
      File: file2._id
    };
    ListDataRetriever(config)
      .retrieve()
      .then(function(results) {
        expect(results.sources[0]).to.have.property(
          "DisplayName",
          "Cohort - Stand Alone"
        );
        done();
      })
      .catch(function(err) {
        console.log(err);
        done();
      });
  });

  it("when the search is source 1 should return 1 files and 1 record", function(
    done
  ) {
    config.search = {
      Source: source._id
    };
    ListDataRetriever(config)
      .retrieve()
      .then(function(results) {
        expect(results.sources).to.have.length(1);
        expect(results.files).to.have.length(1);
        expect(results.records).to.have.length(1);
        done();
      })
      .catch(function(err) {
        console.log(err);
        done();
      });
  });

  it("when the search is source 2 should return 2 files and 2 records", function(
    done
  ) {
    config.search = {
      Source: source2._id
    };
    ListDataRetriever(config)
      .retrieve()
      .then(function(results) {
        expect(results.sources).to.have.length(1);
        expect(results.files).to.have.length(2);
        expect(results.records).to.have.length(2);
        done();
      })
      .catch(function(err) {
        console.log(err);
        done();
      });
  });

  it("when the search is (state: nsw) should return 2 files, 2 sources and 3 records", function(
    done
  ) {
    config.search = {
      State: "NSW"
    };
    ListDataRetriever(config)
      .retrieve()
      .then(function(results) {
        expect(results.sources).to.have.length(2);
        expect(results.files).to.have.length(2);
        expect(results.records).to.have.length(3);
        done();
      })
      .catch(function(err) {
        console.log(err);
        done();
      });
  });

  it("when the search is (state: QLD) should return 0 files, 0 sources and 0 records", function(
    done
  ) {
    config.search = {
      State: "QLD"
    };
    ListDataRetriever(config)
      .retrieve()
      .then(function(results) {
        expect(results.sources).to.have.length(0);
        expect(results.files).to.have.length(0);
        expect(results.records).to.have.length(0);
        done();
      })
      .catch(function(err) {
        console.log(err);
        done();
      });
  });

  it("when the search is (Gender: Male) should return 2 files, 2 sources and 3 records", function(
    done
  ) {
    config.search = {
      Gender: "Male"
    };
    ListDataRetriever(config)
      .retrieve()
      .then(function(results) {
        expect(results.sources).to.have.length(2);
        expect(results.files).to.have.length(2);
        expect(results.records).to.have.length(3);
        done();
      })
      .catch(function(err) {
        console.log(err);
        done();
      });
  });

  it("when the search is (Gender: Female) should return 0 files, 0 sources and 0 records", function(
    done
  ) {
    config.search = {
      Gender: "Female"
    };
    ListDataRetriever(config)
      .retrieve()
      .then(function(results) {
        expect(results.sources).to.have.length(0);
        expect(results.files).to.have.length(0);
        expect(results.records).to.have.length(0);
        done();
      })
      .catch(function(err) {
        console.log(err);
        done();
      });
  });

  it("when called should have populated sources and files", function(done) {
    config.search = {
      Gender: "Male"
    };
    ListDataRetriever(config)
      .retrieve()
      .then(function(results) {
        expect(results.sources[0]).to.have.property(
          "DisplayName",
          "Cohort - Stand Alone"
        );
        expect(results.sources[1]).to.have.property(
          "DisplayName",
          "8th Floor - Stand Alone"
        );
        expect(results.files[0]).to.have.property("Name", "File 1");
        expect(results.files[1]).to.have.property("Name", "File 2");

        done();
      })
      .catch(function(err) {
        console.log(err);
        done();
      });
  });
});
