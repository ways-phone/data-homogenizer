(function() {
  "use strict";

  angular.module("export").factory("DatasetNameService", DatasetNameService);

  DatasetNameService.inject = [];

  function DatasetNameService() {
    var DatasetNameService = {
      createName: createName
    };

    return DatasetNameService;

    ////////////////
    function createName(selectedLists, customName) {
      customName = replaceCount(selectedLists, customName);

      return addTypeToName(selectedLists, customName);
    }

    function replaceCount(selectedLists, customName) {
      var count = 0;
      selectedLists.forEach(getCount);

      return customName.replace(/\(\d+\)/, "(" + count + ")");

      //////////////////////////

      function getCount(list) {
        count += list.Count;
      }
    }

    function addTypeToName(selectedLists, customName) {
      var types = [];
      selectedLists.forEach(getTypes);

      var original = getOriginalType();
      var newType = createNewType();

      setNewType(newType);
      return customName;
      ///////////////////////

      function createNewType() {
        if (types.length > 1) {
          return "[Combined]";
        } else if (types.length > 0) {
          return "[" + original + " | " + types.join(" | ") + "]";
        } else {
          return "[" + original + "]";
        }
      }

      function setNewType(type) {
        customName = customName.replace(/\[.+\]/, type);
      }

      function getOriginalType() {
        if (!customName.match(/\[.+\]/)) {
          return;
        }
        return customName
          .match(/\[.+\]/)[0]
          .replace("[", "")
          .replace("]", "");
      }

      function getTypes(list) {
        if (!list.Name.match(/\[.+\]/)) {
          return;
        }
        var type = list.Name
          .match(/\[.+\]/)[0]
          .replace("[", "")
          .replace("]", "");

        if (types.indexOf(type) === -1 && customName.indexOf(type) === -1) {
          types.push(type);
        }
      }
    }
  }
})();
