"use strict";
describe("List Aggregate Query Creator", function() {
  beforeEach(module("list"));

  var $q;
  var $scope;
  var deferred;
  var controller;
  var client1;
  var client2;
  var campaign;
  var lists;
  var aggregateQueryCreator;
  var row;

  beforeEach(
    inject(function(AggregateQueryCreator) {
      aggregateQueryCreator = AggregateQueryCreator;

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

      row = {
        count: 332,
        _id: {
          File: {
            _id: 2,
            Name: "Test File"
          },
          Source: {
            _id: 3,
            DisplayName: "8th Floor - Stand Alone",
            Name: "8th Floor",
            Type: "Stand Alone"
          }
        },
        File: "Test File",
        Source: "8th Floor - Stand Alone"
      };
    })
  );

  it("should contain a search and count property on the query object returned", function() {
    var query = aggregateQueryCreator.create(row);
    expect(query).to.have.property("search");
    expect(query).to.have.property("count");
  });

  it("should handle nested objects (File and Source) and retrieve them from the _id prop of the row", function() {
    var query = aggregateQueryCreator.create(row);

    expect(query.search).to.have.property("File");
    expect(query.search.File).to.deep.equal(row._id.File);
    expect(query.search).to.have.property("Source");
    expect(query.search.Source).to.deep.equal(row._id.Source);
  });

  it("should correctly set the record status booleans", function() {
    var query = aggregateQueryCreator.create(row);

    expect(query.search.isInvalid).to.eq(false);
    expect(query.search.isExported).to.eq(false);
    expect(query.search.isExcluded).to.eq(false);
    expect(query.search.List).to.deep.equal(null);
  });

  it("should correctly set the count property", function() {
    var query = aggregateQueryCreator.create(row);

    expect(query.count).to.eq(332);
  });
});
