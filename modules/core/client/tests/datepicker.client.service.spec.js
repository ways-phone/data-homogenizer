"use strict";
beforeEach(module("data-uploader"));

describe("Datepicker", function() {
  var datePicker;

  beforeEach(
    inject(function(DatePicker) {
      datePicker = DatePicker;
    })
  );

  it("should return an object with today, clear, open and setStart properties", function() {
    expect(datePicker.today).to.exist;
    expect(datePicker.clear).to.exist;
    expect(datePicker.open).to.exist;
    expect(datePicker.setStart).to.exist;
  });

  it("should return an object with the same start and end date when running today method", function() {
    var today = datePicker.today();
    expect(today.start).to.exist;
    expect(today.end).to.exist;
    expect(today.start).to.eql(today.end);
  });

  it("should return null when the clear method is used", function() {
    var date = new Date();
    var cleared = datePicker.clear(date);
    expect(cleared).to.eql(null);
  });

  it("should set the opened property to true when the open method is called", function() {
    var popup = {
      opened: false
    };
    datePicker.open(popup);
    expect(popup.opened).to.eql(true);
  });

  it("should set the start property to true when the setStart method is called", function() {
    var start = new Date();
    var should = new Date(2017, 6, 2);
    start = datePicker.setStart(2017, 6, 2, start);
    expect(start).to.eql(should);
  });

  it("should return the entire datapicker object when Object method is called", function() {
    var picker = datePicker.Object();
    expect(picker).to.have.property("today");
    expect(picker).to.have.property("popup1");
    expect(picker).to.have.property("popup2");
    expect(picker).to.have.property("date");
    expect(picker).to.have.property("open");
  });
});
