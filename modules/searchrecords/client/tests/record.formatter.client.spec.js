"use strict";
describe("Search Records Record Formatter", function() {
  beforeEach(module("list"));

  var $q;
  var $scope;
  var deferred;
  var controller;
  var client1;
  var client2;
  var campaign;
  var recordFormatter;
  var records;

  beforeEach(
    inject(function(RecordFormatter) {
      recordFormatter = RecordFormatter;

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

      records = [
        {
          _id: 1,
          CustKey: 1,
          Client: client1,
          Campaign: campaign,
          FirstName: "Miles",
          LastName: "Johnson",
          MobilePhone: "483123456",
          Phone1: "61483123456",
          isExported: false,
          Created: new Date(2017, 4, 4)
        },
        {
          _id: 2,
          CustKey: 2,
          Client: client1,
          Campaign: campaign,
          Source: {
            DisplayName: "8th Floor - Stand Alone",
            _id: 1,
            Name: "8th Floor",
            Type: "Stand Alone"
          },
          FirstName: "Test",
          LastName: "Testerson",
          MobilePhone: "411111111",
          Phone1: "61411111111",
          isExported: false,
          Created: new Date(2017, 4, 4)
        },
        {
          _id: 3,
          CustKey: 3,
          Client: client1,
          Campaign: campaign,
          FirstName: "Lora",
          LastName: "Stockley",
          MobilePhone: "423123452",
          Phone1: "61423123452",
          isExported: false,
          Created: new Date(2017, 4, 4)
        }
      ];
    })
  );

  it("on format, should set nested objects as disabled and set the value to be the name", function() {
    var formatted = recordFormatter.format(records[0]);
    expect(formatted.Client).to.have.property("disabled", true);
    expect(formatted.Client).to.have.property(
      "value",
      "Medicins Sans Frontieres"
    );

    expect(formatted.Campaign).to.have.property("disabled", true);
    expect(formatted.Campaign).to.have.property("value", "Lead Conversion");
  });
  it('on format, should mark "is" fields as a select', function() {
    var formatted = recordFormatter.format(records[0]);

    expect(formatted.isExported).to.have.property("select", true);
    expect(formatted.isExported).to.have.property("bool", "false");
  });
  it("on format, should format dates and mark them as disabled", function() {
    var formatted = recordFormatter.format(records[0]);

    expect(formatted.Created).to.have.property("disabled", true);
    expect(formatted.Created).to.have.property("value", "04/05/2017 00:00");
  });
  it("on format, should handle nested DisplayName and Name", function() {
    var formatted = recordFormatter.format(records[1]);

    expect(formatted.Source).to.have.property(
      "value",
      "8th Floor - Stand Alone"
    );
    expect(formatted.Campaign).to.have.property("value", "Lead Conversion");
  });

  it("on update, should ignore nested fields and return only non disabled fields", function() {
    var formatted = recordFormatter.format(records[1]);
    var update = recordFormatter.createUpdate(formatted);

    expect(update).to.deep.equal({
      FirstName: "Test",
      LastName: "Testerson",
      MobilePhone: "411111111",
      Phone1: "61411111111",
      isExported: false
    });
  });

  it("on update, should handle changing values via the drop down", function() {
    var formatted = recordFormatter.format(records[1]);
    formatted.isExported.bool = "true";
    var update = recordFormatter.createUpdate(formatted);

    expect(update).to.deep.equal({
      FirstName: "Test",
      LastName: "Testerson",
      MobilePhone: "411111111",
      Phone1: "61411111111",
      isExported: true
    });
  });

  it("on update, should handle updating a regular field", function() {
    var formatted = recordFormatter.format(records[1]);
    formatted.FirstName = "Changed";
    var update = recordFormatter.createUpdate(formatted);

    expect(update).to.deep.equal({
      FirstName: "Changed",
      LastName: "Testerson",
      MobilePhone: "411111111",
      Phone1: "61411111111",
      isExported: false
    });
  });
});
