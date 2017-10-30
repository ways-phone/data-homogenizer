"use strict";
describe("List Aggregate Formatter", function() {
  beforeEach(module("list"));

  var $q;
  var $scope;
  var deferred;
  var controller;
  var client1;
  var client2;
  var campaign;
  var lists;
  var aggregateFormatter;
  var listToAdd;
  var simpleCounts;
  var complexCounts;
  beforeEach(
    inject(function(AggregateFormatter) {
      aggregateFormatter = AggregateFormatter;

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

      simpleCounts = [
        {
          _id: {
            State: "VIC",

            count: 100
          }
        },
        {
          _id: {
            State: "NSW",
            count: 200
          }
        }
      ];

      complexCounts = [
        {
          _id: {
            State: "VIC",
            Source: {
              DisplayName: "8th Floor - Grid",
              _id: 1
            },
            File: {
              _id: 1,
              Name: "MSF Lead Conversion"
            },
            count: 200
          }
        },
        {
          _id: {
            State: "VIC",
            Source: {
              DisplayName: "8th Floor - Stand Alone",
              _id: 1
            },
            File: {
              _id: 2,
              Name: "MSF Lead Conversion - 8th Floor"
            },
            count: 233
          }
        }
      ];
    })
  );

  it("should return an object with a row and header property", function() {
    var formatted = aggregateFormatter.format(simpleCounts);
    expect(formatted).to.have.property("rows");
    expect(formatted).to.have.property("header");
  });

  it("should handle formatting an array of states", function() {
    var formatted = aggregateFormatter.format(simpleCounts);

    expect(formatted.rows[0]).to.have.property("State", "VIC");
    expect(formatted.rows[0]).to.have.property("count", 100);
    expect(formatted.header).to.deep.equal(["State", "count"]);
  });

  it("should handle formatting an array with nested objects", function() {
    var formatted = aggregateFormatter.format(complexCounts);

    expect(formatted.rows.length).to.eq(2);
    expect(formatted.rows[0]).to.have.property("Source", "8th Floor - Grid");
    expect(formatted.rows[0]).to.have.property("State", "VIC");
    expect(formatted.rows[0]).to.have.property("File", "MSF Lead Conversion");
    expect(formatted.rows[0]).to.have.property("count", 200);
    expect(formatted.header).to.deep.equal([
      "State",
      "Source",
      "File",
      "count"
    ]);
  });

  it("should always place counts as the last column", function() {
    var simple = aggregateFormatter.format(simpleCounts);
    var complex = aggregateFormatter.format(complexCounts);

    expect(simple.header[simple.header.length - 1]).to.eq("count");
    expect(complex.header[complex.header.length - 1]).to.eq("count");
  });

  it("should always remove _id from keys", function() {
    var simple = aggregateFormatter.format(simpleCounts);
    var complex = aggregateFormatter.format(complexCounts);
    expect(simple.header).to.not.include("_id");
    expect(complex.header).to.not.include("_id");
  });

  it("should return undefined if no counts are passed in as a parameter", function() {
    var und = aggregateFormatter.format();
    expect(und).to.eq(undefined);
  });

  it("should return undefined if a counts object with length 0 is passed in", function() {
    var und = aggregateFormatter.format([]);
    expect(und).to.eq(undefined);
  });
});
