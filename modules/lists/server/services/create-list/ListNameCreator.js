"use strict";

module.exports = (function ListNameCreator() {
  return function(config) {
    return {
      create: create
    };

    function create() {
      var name = config.client.Acronym + " " + config.campaign.Name + "_[";

      var exclude = [
        "",
        "Campaign",
        "List",
        "isDuplicate",
        "isDuplicateWithinFile",
        "isInvalid",
        "isExcluded",
        "isExported"
      ];

      var nested = ["Source", "File"];

      Object.keys(config.search).forEach(function(key) {
        if (exclude.indexOf(key) !== -1) return;

        var value = config.search[key];

        if (nested.indexOf(key) !== -1) {
          name += (value.DisplayName || value.Name) + "|";
        } else {
          name += value + "|";
        }
      });
      name = name.slice(0, name.length - 1);

      return name + "]_" + createListDate() + "_(" + config.count + ")";
    }

    function createListDate() {
      var today;
      if (config.date) {
        today = new Date(config.date[0], config.date[1], config.date[2]);
      } else {
        today = new Date();
      }

      var day = ("0" + today.getDate().toString()).slice(-2);
      var month = ("0" + (today.getMonth() + 1)).slice(-2);
      var year = today
        .getFullYear()
        .toString()
        .slice(-2);

      return day + month + year;
    }
  };
})();
