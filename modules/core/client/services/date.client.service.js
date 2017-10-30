(function() {
  "use strict";

  angular.module("core").factory("DateFormat", DateFormatter);

  function DateFormatter() {
    var service = {
      createTimestamp: createTimestamp,
      setTimestamp: setTimestamp,
      formatDate: formatDate,
      fileDate: fileDate
    };

    return service;

    function setTimestamp(obj) {
      obj.timestamp = {
        created: createTimestamp(obj.Created),
        updated: createTimestamp(obj.Updated)
      };
      return obj;
    }
    function fileDate(datestring) {
      var date = createDate(datestring);
      return getDay(date) + getMonth(date) + getYear(date, 2);
    }

    function formatDate(datestring) {
      var date = createDate(datestring);
      return getDay(date) + "/" + getMonth(date) + "/" + getYear(date, 4);
    }

    function createTimestamp(dateString) {
      var date = createDate(dateString);
      return (
        getDay(date) +
        "/" +
        getMonth(date) +
        "/" +
        getYear(date, 4) +
        " " +
        getHours(date) +
        ":" +
        getMinutes(date)
      );
    }

    function createDate(string) {
      var date;
      try {
        return new Date(string);
      } catch (e) {
        return new Error("not a date");
      }
    }

    function getDay(date) {
      return addZero(date.getDate());
    }

    function getMonth(date) {
      return addZero(date.getMonth() + 1);
    }

    function getYear(date, digits) {
      return date
        .getFullYear()
        .toString()
        .slice(-digits);
    }

    function getHours(date) {
      return addZero(date.getHours());
    }

    function getMinutes(date) {
      return addZero(date.getMinutes());
    }

    function addZero(number) {
      return ("0" + number).slice(-2);
    }
  }
})();
