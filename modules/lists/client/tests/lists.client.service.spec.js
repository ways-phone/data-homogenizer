"use strict";
describe("List Service", function() {
  beforeEach(module("list"));

  var $q;
  var $scope;
  var deferred;
  var controller;
  var client1;
  var client2;
  var campaign;
  var lists;
  var listService;
  var row;
  var resource;
  var $resource;
  var $routeParams;
  beforeEach(function() {
    module(function($provide) {
      resource = {
        get: sinon.spy()
      };
      $resource = function() {
        return resource;
      };
      $routeParams = {};

      $provide.value("$resource", $resource);
      $provide.value("$routeParams", $routeParams);
    });
  });

  beforeEach(
    inject(function(ListService) {
      listService = ListService;

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
  describe("on creating the record count request", function() {
    it("for a Source query, should set the lookup1 and unwind1 properties", function() {
      var query = {
        $group: {
          Source: true
        }
      };

      listService.sendRecordCountRequest(query);
      sinon.assert.calledOnce(resource.get);
      sinon.assert.calledWithMatch(resource.get, {
        data: {
          lookup1: {
            from: "sources",
            localField: "_id.Source",
            foreignField: "_id",
            as: "_id.Source"
          },
          unwind1: "$_id.Source"
        }
      });
    });

    it("for a File query, should set the lookup2 and unwind2 properties", function() {
      var query = {
        $group: {
          File: true
        }
      };

      listService.sendRecordCountRequest(query);
      sinon.assert.calledOnce(resource.get);
      sinon.assert.calledWithMatch(resource.get, {
        data: {
          lookup2: {
            from: "files",
            localField: "_id.File",
            foreignField: "_id",
            as: "_id.File"
          },
          unwind2: "$_id.File"
        }
      });
    });

    it("for a Source and File query, should set the lookup1, unwind1, lookup2, unwind2 properties ", function() {
      var query = {
        $group: {
          File: true,
          Source: true
        }
      };
      listService.sendRecordCountRequest(query);
      sinon.assert.calledOnce(resource.get);
      sinon.assert.calledWithMatch(resource.get, {
        data: {
          lookup1: {
            from: "sources",
            localField: "_id.Source",
            foreignField: "_id",
            as: "_id.Source"
          },
          unwind1: "$_id.Source",
          lookup2: {
            from: "files",
            localField: "_id.File",
            foreignField: "_id",
            as: "_id.File"
          },
          unwind2: "$_id.File"
        }
      });
    });

    it("for a query that doesnt include Source or File, should not set lookup or unwind props", function() {
      var query = {
        $group: {
          State: true
        }
      };
      listService.sendRecordCountRequest(query);
      sinon.assert.calledOnce(resource.get);
      sinon.assert.calledWithMatch(resource.get, {
        data: { $group: { State: "$State" } }
      });
    });

    it('should convert booleans to putting a "$" before the bool name', function() {
      var query = {
        $group: {
          State: true,
          Gender: true,
          File: true,
          Source: true
        }
      };
      listService.sendRecordCountRequest(query);
      sinon.assert.calledOnce(resource.get);
      sinon.assert.calledWithMatch(resource.get, {
        data: {
          $group: {
            State: "$State",
            Gender: "$Gender",
            File: "$File",
            Source: "$Source"
          }
        }
      });
    });
  });
});
