"use strict";
describe("Dataset Name Service", function() {
  beforeEach(module("export"));
  var client1;
  var client2;
  var campaign;
  var list1;
  var list2;
  var list3;
  var exportedList;
  var dataset;
  var listToAdd;
  var datasetNameService;

  beforeEach(
    inject(function(DatasetNameService) {
      datasetNameService = DatasetNameService;

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

      list1 = {
        Name: "MSF Lead Conversion [8th floor] 040617-040617 (100)",
        _id: 1,
        Created: new Date(2017, 4, 4),
        Updated: new Date(2017, 4, 4),
        Count: 10
      };
      list2 = {
        Name: "MSF Lead Conversion [eGentic - Stand Alone] 040617-040617 (100)",
        _id: 2,
        Created: new Date(2017, 4, 4),
        Updated: new Date(2017, 4, 4),
        Count: 20
      };
      list3 = {
        Name:
          "MSF Lead Conversion [Offers Now - Stand Alone] 040617-040617 (100)",
        _id: 3,
        Created: new Date(2017, 4, 4),
        Updated: new Date(2017, 4, 4),
        Count: 40
      };
      exportedList = {
        Name: "exported list",
        _id: 3,
        Created: new Date(2017, 4, 4),
        Updated: new Date(2017, 4, 4),
        isExported: true
      };

      listToAdd = {
        Name: "add list",
        _id: 4,
        Created: new Date(2017, 4, 4),
        Updated: new Date(2017, 4, 4),
        isExported: false,
        Count: 40
      };
      dataset = {
        Name: "Test Dataset 1",
        _id: 1,
        List: [list1]
      };

      campaign = {
        Name: "Lead Conversion",
        _id: 1,
        Client: client1._id,
        Path: "Lead_Conversion",
        Conversion: 4.5,
        ContactRate: 4.6,
        Files: [
          {
            Created: new Date(2017, 4, 3),
            Updated: new Date(2017, 4, 3)
          }
        ],
        Sources: [],
        Lists: [list1, list2, exportedList]
      };
    })
  );

  it("should conjoin any text within square brackets and add counts", function() {
    var selectedLists = [list1, list2];
    var customName = list1.Name;

    var name = datasetNameService.createName(selectedLists, customName);

    expect(name).to.eq(
      "MSF Lead Conversion [8th floor | eGentic - Stand Alone] 040617-040617 (30)"
    );
  });

  it("should mark a list as combined for any more than 2 lists", function() {
    var selectedLists = [list1, list2, list3];
    var customName = list1.Name;

    var name = datasetNameService.createName(selectedLists, customName);

    expect(name).to.eq("MSF Lead Conversion [Combined] 040617-040617 (70)");
  });

  it("should handle lists without any square brackets and add counts", function() {
    list1.Name = "Test List 1 (10)";
    list2.Name = "Test List 2 (10)";
    list3.Name = "Test List 3 (10)";
    var selectedLists = [list1, list2, list3];
    var customName = list1.Name;

    var name = datasetNameService.createName(selectedLists, customName);

    expect(name).to.eq("Test List 1 (70)");
  });
});
