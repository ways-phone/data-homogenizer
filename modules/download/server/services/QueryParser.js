"use strict";

module.exports = (function QueryParser() {
  return {
    parse: parse
  };

  function parse(query) {
    if (query.Created) {
      query.Created = date(query.Created);
    }

    return {
      query: record(query),
      dupeQuery: dupe(query)
    };
  }

  function date(dateString) {
    return JSON.parse(dateString);
  }

  function record(query) {
    var nQuery = {};

    Object.keys(query).forEach(function(key) {
      if (key !== "$or") nQuery[key] = query[key];
    });

    return nQuery;
  }

  function dupe(query) {
    var dupeQ = {};

    var exclude = ["$or", "isInvalid"];

    if (query.$or) {
      Object.keys(query).forEach(function(key) {
        if (exclude.indexOf(key) === -1) dupeQ[key] = query[key];
      });
    } else {
      dupeQ = {
        isDuplicate: false,
        isDuplicateWithinFile: false
      };
    }

    return dupeQ;
  }
})();
