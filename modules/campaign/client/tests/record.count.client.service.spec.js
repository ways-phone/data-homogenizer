"use strict";
beforeEach(module("data-uploader"));

describe("Record Count Service", function() {
  var recordCountService;
  var client;
  var campaign;
  var data;
  var emptyData;
  beforeEach(
    inject(function(RecordCountService) {
      recordCountService = RecordCountService;

      client = {
        Name: "Medicins Sans Frontieres",
        Acronym: "MSF",
        _id: 1,
        Campaigns: [1]
      };

      campaign = {
        Name: "Lead Conversion",
        _id: 1,
        Client: client._id,
        Path: "Lead_Conversion",
        Conversion: 4.5,
        ContactRate: 4.6,
        Files: [],
        Sources: []
      };
      emptyData = {
        Total: 0
      };
      data = {
        Total: 400,
        Dupes: 5,
        DupesWithinFile: 4
      };
    })
  );

  it("should calculate regs and toContact for a full counts object returned", function() {
    var expected = {
      Total: 409,
      Dupes: 5,
      DupesWithinFile: 4,
      callable: 96,
      regs: 18,
      toContact: 18
    };
    var counts = recordCountService.createCounts(data, campaign);
    expect(counts).to.deep.equal(expected);
  });

  it("should set all values as zero for and empty counts object", function() {
    var expected = {
      Total: 0,
      Invalids: 0,
      Dupes: 0,
      DupesWithinFile: 0,
      callable: 0,
      regs: 0,
      toContact: 0
    };
    var counts = recordCountService.createCounts(emptyData, campaign);
    expect(counts).to.deep.equal(expected);
  });
});
