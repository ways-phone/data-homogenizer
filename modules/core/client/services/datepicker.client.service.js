(function() {
  "use strict";

  angular.module("core").factory("DatePicker", DatePicker);

  DatePicker.$inject = [];

  function DatePicker() {
    var service = {
      today: today,
      clear: clear,
      open: open,
      setStart: setStart,
      Object: function() {
        return {
          today: today,
          popup1: {},
          popup2: {},
          date: {},
          open: open
        };
      }
    };

    return service;

    function getData() {}

    function today() {
      return {
        start: new Date(),
        end: new Date()
      };
    }

    function clear(start) {
      start = null;
      return start;
    }

    function open(popup) {
      popup.opened = true;
    }

    function setStart(year, month, day, start) {
      return new Date(year, month, day);
    }
  }
})();
