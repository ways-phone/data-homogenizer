"use strict";
beforeEach(module("data-uploader"));

describe("Modal Service", function() {
  var modalService;
  var $document;
  var $uibModal;

  beforeEach(function() {
    module(function($provide) {
      $uibModal = {
        open: function(config) {
          return config;
        }
      };
      $document = [
        {
          querySelector: function() {
            return "<div></div>";
          }
        }
      ];

      $provide.value("$uibModal", $uibModal);
      $provide.value("$document", $document);
    });
  });
  beforeEach(
    inject(function(ModalService) {
      modalService = ModalService;
    })
  );

  it("should set the correct template url", function() {
    var config = {
      location: "core",
      name: "Add-Client",
      size: "md"
    };
    var modalConfig = modalService.createModal(config);

    expect(modalConfig.templateUrl).to.eq(
      "/core/client/views/add-client.client.view.html"
    );
  });

  it("should set the size", function() {
    var config = {
      location: "core",
      name: "Add-Client",
      size: "md"
    };
    var modalConfig = modalService.createModal(config);

    expect(modalConfig.size).to.eq("md");
  });

  it("should set the correct controller name", function() {
    var config = {
      location: "core",
      name: "Add-Client",
      size: "md"
    };
    var modalConfig = modalService.createModal(config);

    expect(modalConfig.size).to.eq("md");
  });

  it("should set the resolve property", function() {
    var config = {
      location: "core",
      name: "Add-Client",
      size: "md",
      resolve: {
        Client: {
          Name: "Test Client",
          Acronym: "TTT",
          _id: 1
        }
      }
    };
    var modalConfig = modalService.createModal(config);

    expect(modalConfig.resolve.data).to.eql({
      Client: {
        Name: "Test Client",
        Acronym: "TTT",
        _id: 1
      }
    });
  });
});
