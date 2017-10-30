"use strict";
describe("Header Format Service", function() {
  beforeEach(module("export"));

  var deferred;
  var controller;
  var client1;
  var client2;
  var campaign;
  var headerMapService;
  var headerConfig;
  var headerFiles;

  var listToAdd;
  beforeEach(
    inject(function(HeaderMapService) {
      headerMapService = HeaderMapService;

      client1 = {
        Name: "Medicins Sans Frontieres",
        Acronym: "MSF",
        _id: 1,
        Campaigns: [1]
      };

      client2 = {
        Name: "Taronga",
        Acronym: "TZ",
        _id: 2,
        Campaigns: ["Lead Conversion", "Recycled"]
      };

      campaign = {
        Name: "Lead Conversion",
        _id: 1,
        Client: client1._id,
        Path: "Lead_Conversion",
        Conversion: 4.5,
        ContactRate: 4.6,
        Files: [],
        Sources: [],
        Lists: []
      };

      var auth = {
        authenticate: function() {
          return true;
        }
      };

      headerConfig = {
        tableData: [
          ["test", 1, "Consumer_ID"],
          [2, "Consumer_ID"],
          [3, "Consumer_ID"]
        ],
        keys: ["file", "_id", "CustKey"]
      };

      headerFiles = ["list of files"];
    })
  );

  it("should split a header object into its keys and values", function() {
    var headers = [
      {
        CustKey: "Consumer ID",
        _id: "1",
        __v: 2,
        Campaign: { nested: "object" },
        Client: { nested: "object" },
        OriginalFile: "Test File 1"
      }
    ];
    var formatted = headerMapService.formatHeaders(headers);
    expect(formatted).to.have.property("tableData");
    expect(formatted).to.have.property("keys");
  });

  it("on formatting, should remove nested objects from the header ", function() {
    var headers = [
      {
        CustKey: "Consumer ID",
        _id: "1",
        __v: 2,
        Campaign: { nested: "object" },
        Client: { nested: "object" },
        Address1: "address",
        Suburb: "Suburb"
      }
    ];
    var formatted = headerMapService.formatHeaders(headers);
    expect(formatted.keys).to.deep.equal([
      "CustKey",
      "_id",
      "Address1",
      "Suburb"
    ]);
  });

  it("on formatting, should set OriginalFile as the first key ", function() {
    var headers = [
      {
        CustKey: "Consumer ID",
        _id: "1",
        __v: 2,
        Campaign: { nested: "object" },
        Client: { nested: "object" },
        Address1: "address",
        Suburb: "Suburb",
        OriginalFile: "Test File"
      }
    ];
    var formatted = headerMapService.formatHeaders(headers);
    expect(formatted.keys[0]).to.eq("OriginalFile");
  });

  it("keys and tableData should match in order", function() {
    var headers = [
      {
        CustKey: "Consumer ID",
        _id: "1",
        __v: 2,
        Campaign: { nested: "object" },
        Client: { nested: "object" },
        Address1: "address",
        Suburb: "Suburb",
        OriginalFile: "Test File"
      }
    ];
    var formatted = headerMapService.formatHeaders(headers);
    expect(formatted.keys).to.deep.equal([
      "OriginalFile",
      "CustKey",
      "_id",
      "Address1",
      "Suburb"
    ]);

    expect(formatted.tableData).to.deep.equal([
      ["Test File", "Consumer ID", "1", "address", "Suburb"]
    ]);
  });
});
