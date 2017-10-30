(function() {
  "use strict";

  angular.module("upload").factory("SourceUploadService", SourceUploadService);

  SourceUploadService.$inject = ["$resource", "$q", "$routeParams"];

  function SourceUploadService($resource, $q, $routeParams) {
    var resource = $resource("/api/:acronym/:path/source-map");
    var service = {
      saveSourceMap: saveSourceMap,
      fillSources: fillSources,
      findExistingSources: findExistingSources,
      setAllSources: setAllSources
    };

    return service;

    function saveSourceMap(config) {
      var map = createSourceMap(config);
      var deferred = $q.defer();
      var saveSourceMap = new resource(map);
      saveSourceMap.$save($routeParams, function(response) {
        if (!!response.error) {
          deferred.reject(response.error);
        } else {
          deferred.resolve(response.data);
        }
      });
      return deferred.promise;
    }

    function fillSources(maps, records) {
      var counter = 0;
      maps.forEach(iterateSourceMaps);

      return counter === records.length;

      function iterateSourceMaps(map) {
        records.forEach(setSourceOnRow);

        //////////////////

        function setSourceOnRow(row) {
          if (row.Source !== map.Name) return;
          row.Source = map.Source;
          row.OriginalCost = map.Source.Cost;
          counter++;
        }
      }
    }

    function findExistingSources(records) {
      var existingSources = [];
      records.forEach(function(record) {
        if (!record.Source) return;
        if (existingSources.indexOf(record.Source) !== -1) return;
        if (record.Source.Name) return;

        existingSources.push(record.Source);
      });

      return existingSources;
    }

    function createSourceMap(config) {
      var mapping = [];
      config.sourceMaps.forEach(function(source, index) {
        mapping.push({
          Name: config.existingSources[index],
          Source: source,
          Campaign: config.campaign
        });
      });
      mapToRecords(mapping, config.records);
      return { map: mapping };
    }

    function mapToRecords(mapping, records) {
      mapping.forEach(function(map) {
        records.forEach(function(record) {
          if (record.Source !== map.Name) return;

          record.Source = map.Source;
          record.OriginalCost = map.Source.Cost;
        });
      });
    }

    function setAllSources(source, records) {
      if (!source) return;

      return records.map(function(record) {
        record.Source = source;
        record.OriginalCost = source.Cost;
        return record;
      });
    }
  }
})();
