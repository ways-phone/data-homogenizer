"use strict";
beforeEach(module("data-uploader"));

describe("General Services", function() {
  var generalFuncService;

  beforeEach(
    inject(function(GeneralFuncService) {
      generalFuncService = GeneralFuncService;
    })
  );

  it("should capitalize a single word", function() {
    var capital = generalFuncService.capitalize("test");
    expect(capital).to.eq("Test");
  });

  it("should capitalize a sentence", function() {
    var capital = generalFuncService.capitalize("this is a test sentence");
    expect(capital).to.eq("This Is A Test Sentence");
  });
});
