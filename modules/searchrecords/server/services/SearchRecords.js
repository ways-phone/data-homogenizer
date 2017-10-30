"use strict";

var mongoose = require("mongoose");
var Record = mongoose.model("Record");
var Dupes = mongoose.model("DupeRecord");
var Promise = require("bluebird");

module.exports = (function() {
  return function(query) {
    return { search: search };

    function search() {
      var formattedQuery = formatQuery();

      return Promise.all([
        getRecords(formattedQuery),
        getDupes(formattedQuery)
      ]).spread(function(records, dupes) {
        return records.concat(dupes);
      });
    }

    function getRecords(query) {
      return Record.find(query)
        .lean()
        .populate("Source File Client Campaign List Header");
    }

    function getDupes(query) {
      return Dupes.find(query)
        .lean()
        .populate("Source File Client Campaign List Header");
    }

    function formatQuery() {
      query.Created = formatDates(query.Range);

      if (query.search) {
        Object.assign(query, formatSearchFields(query.search));
        delete query.search;
      }

      delete query.Range;

      return query;
    }

    function formatSearchFields(searchQuery) {
      var search = JSON.parse(searchQuery);

      var query = {};

      if (search.searchText) {
        query[search.selectedField] = search.searchText;
      } else {
        query[search.selectedField] = true;
      }

      return query;
    }

    function formatDates(range) {
      range = JSON.parse(range);

      return {
        $gte: range.start,
        $lt: range.end
      };
    }
  };
})();
