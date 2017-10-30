(function() {
  "use strict";

  angular.module("core").factory("ErrorHandler", ErrorHandler);

  ErrorHandler.$inject = [];

  function ErrorHandler() {
    var service = {
      handleError: handleError
    };

    return service;

    function handleError(e, caller) {
      switch (e.code) {
        case 11000:
          return handleDuplicate(e, caller);
        case "DupeName":
          return {
            message: e.errmsg
          };
      }
    }

    function handleDuplicate(e, caller) {
      return {
        message: caller + " with those details already exists"
      };
    }

    function stripAttribute(errmsg) {
      var re = new RegExp(/index:\s{1}[a-zA-z]+_/, "g");
      var strip = re.exec(errmsg)[0];
      console.log(strip);
      return strip
        .split(":")[1]
        .replace(" ", "")
        .replace("_", "");
    }
  }
})();
