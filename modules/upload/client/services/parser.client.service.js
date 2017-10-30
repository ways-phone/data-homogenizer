(function() {
  "use strict";

  angular.module("upload").factory("FileParser", FileParser);

  FileParser.$inject = ["$q", "Papa"];

  function FileParser($q, Papa) {
    var service = {
      readFile: readFile,
      convertCsvRecordsToJson: convertCsvRecordsToJson
    };

    return service;

    ////////////////
    function readFile(file) {
      var csv = {};
      var deferred = $q.defer();
      var reader = new FileReader();

      if (!isCsv() && !isXls()) return;
      if (isXls()) reader.readAsArrayBuffer(file);
      if (isCsv()) reader.readAsText(file);

      reader.onload = function(e) {
        parse(e.target.result);
      };

      return deferred.promise;
      //////////////////////////////////////

      function parse(rawData) {
        if (isXls()) {
          deferred.resolve(Papa.parse(convertXlsxToCsv(rawData)).data);
        } else if (isCsv()) {
          deferred.resolve(Papa.parse(rawData).data);
        }
        deferred.reject("Something f**ked up man...");

        /////////////////////////////////

        function convertXlsxToCsv(raw_data) {
          var data = new Uint8Array(raw_data);
          var arr = [];

          for (var i = 0; i !== data.length; i++) {
            arr[i] = String.fromCharCode(data[i]);
          }

          var bstr = arr.join("");
          var book = XLSX.read(bstr, { type: "binary" });
          var sheet = book.Sheets[book.SheetNames[0]];

          return XLSX.utils.sheet_to_csv(sheet);
        }
      }

      function isCsv() {
        return file.name.indexOf(".csv") !== -1;
      }

      function isXls() {
        return file.name.indexOf(".xls") !== -1;
      }
    }

    function convertCsvRecordsToJson(originalRecords) {
      var deferred = $q.defer();
      var records = Papa.parse(Papa.unparse(originalRecords), { header: true })
        .data;
      deferred.resolve(records.filter(removeEmptyRows));
      return deferred.promise;

      ////////////////////////////

      function removeEmptyRows(row) {
        return !(row.MobilePhone === undefined && row.HomePhone === undefined);
      }
    }
  }
})();
