(function() {
  "use strict";

  angular.module("campaign").factory("RecordCountService", RecordCountService);

  RecordCountService.inject = [];

  function RecordCountService() {
    var service = {
      createCounts: createCounts
    };

    return service;

    ////////////////
    function createCounts(data, campaign) {
      var counts = data;

      if (counts.Total > 0) {
        var valid = counts.Total - (counts.Dupes + counts.DupesWithinFile);

        counts.Total += counts.Dupes + counts.DupesWithinFile;
        counts.callable = Math.round(valid / counts.Total * 1000 / 10);
        counts.regs = Math.round(valid * (campaign.Conversion / 100));
        counts.toContact = Math.round(valid * (campaign.ContactRate / 100));

        return counts;
      } else {
        return setCountsToZero();
      }
    }

    function setCountsToZero() {
      return {
        Total: 0,
        Invalids: 0,
        Dupes: 0,
        DupesWithinFile: 0,
        callable: 0,
        regs: 0,
        toContact: 0
      };
    }
  }
})();
