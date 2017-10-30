"use strict";
describe("Search Records Service", function() {
  beforeEach(module("list"));

  var $q;
  var $scope;
  var deferred;
  var controller;
  var client1;
  var client2;
  var campaign;
  var queryRecords;
  var query;
  beforeEach(
    inject(function(QueryRecords) {
      queryRecords = QueryRecords;

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

      query = {
        Range: {
          start: new Date(2017, 3, 3),
          end: new Date(2017, 3, 3)
        },
        search: {
          searchText: "asdasd",
          selectedField: "Address1"
        },
        Client: client1,
        Campaign: campaign
      };
    })
  );

  it("should set the hours of the range query to the beginning and end of the day", function() {
    var prepared = queryRecords.prepareSearchQuery(query);
    expect(prepared.Range.start.getHours()).to.eq(0);
    expect(prepared.Range.end.getHours()).to.eq(23);
  });

  it("should flatten any nested objects to just their _id", function() {
    var prepared = queryRecords.prepareSearchQuery(query);

    expect(prepared.Client).to.eq(1);
    expect(prepared.Campaign).to.eq(1);
  });

  it("should determine a query as valid if there is no search object", function() {
    var isValid = queryRecords.isQueryValid({});
    expect(isValid).to.eq(true);
  });

  it("should determine a query invalid if hasDisabledText is false and there is no searchText", function() {
    var query = {
      search: {}
    };
    var isValid = queryRecords.isQueryValid(query, false);
    expect(isValid).to.eq(false);
  });

  it("should determine a query valid if hasDisabledText is false and there is searchText", function() {
    var query = {
      search: {
        searchText: "asdasd"
      }
    };
    var isValid = queryRecords.isQueryValid(query, false);
    expect(isValid).to.eq(true);
  });

  it("should determine a query valid if hasDisabledText is true and there is no search text", function() {
    var query = {
      search: {}
    };
    var isValid = queryRecords.isQueryValid(query, true);
    expect(isValid).to.eq(true);
  });
});
