"use strict";

var mongoose = require("mongoose");
var Promise = require("bluebird");
var Source = mongoose.model("Source");
var File = mongoose.model("File");
var Record = mongoose.model("Record");
var Dupes = mongoose.model("DupeRecord");

module.exports = (function() {
  return function(campaign) {
    return { get: get };

    function get() {
      return distinctFiles().then(returnSourceCountsPerFile);
    }

    function distinctFiles() {
      return File.find({ Campaign: campaign._id });
    }

    function returnSourceCountsPerFile(files) {
      return Promise.map(files, distinctSourceIdByFile);
      //////////////////

      function distinctSourceIdByFile(file) {
        return Record.distinct("Source", { File: file._id })
          .then(distinctSources)
          .then(counts);

        /////////////////////////////////

        function distinctSources(ids) {
          return Source.find({ _id: { $in: ids } });
        }

        function counts(sources) {
          return Promise.map(sources, getCountsForSource);
          /////////////////////////
          function getCountsForSource(source) {
            return Promise.all([
              Record.count({
                Source: source,
                File: file,
                isInvalid: false
              }),
              Record.count({
                Source: source,
                File: file,
                isInvalid: true
              }),
              Dupes.count({
                Source: source,
                File: file,
                isDuplicate: true
              }),
              Dupes.count({
                Source: source._id,
                File: file,
                isDuplicateWithinFile: true
              })
            ]).spread(function(clean, invalids, dupes, dupesWithinFile) {
              return {
                created: file.Created,
                file: file.Name,
                source: source.DisplayName,
                counts: {
                  total: clean + invalids + dupes + dupesWithinFile,
                  clean: clean,
                  invalids: invalids,
                  dupes: dupes,
                  dupesWithinFile: dupesWithinFile
                }
              };
            });
          }
        }
      }
    }
  };
})();
