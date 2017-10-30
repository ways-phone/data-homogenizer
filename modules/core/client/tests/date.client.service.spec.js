"use strict";
beforeEach(module("data-uploader"));

describe("Date Formatter", function() {
  var dateFormat;

  beforeEach(
    inject(function(DateFormat) {
      dateFormat = DateFormat;
    })
  );

  it("should correctly parse date string as timestamp", function() {
    var date = dateFormat.createTimestamp(new Date(2017, 3, 3, 2, 1, 1));

    expect(date).to.eq("03/04/2017 02:01");
  });

  it("should correctly parse data string as date", function() {
    var date = dateFormat.formatDate(new Date(2017, 3, 3, 2, 1, 1));

    expect(date).to.eq("03/04/2017");
  });

  it("should correctly create a timestamp object", function() {
    var obj = {
      Created: new Date(2017, 3, 3, 2, 1, 1),
      Updated: new Date(2017, 4, 3, 2, 1, 1)
    };
    var date = dateFormat.setTimestamp(obj);

    expect(date)
      .to.have.property("timestamp")
      .and.to.have.property("created", "03/04/2017 02:01");
    expect(date)
      .to.have.property("timestamp")
      .and.to.have.property("updated", "03/05/2017 02:01");
  });
});
