(function() {
  "use strict";

  angular.module("upload").factory("UploadFileService", UploadFileService);

  UploadFileService.$inject = ["FileParser", "HeaderService"];

  function UploadFileService(FileParser, HeaderService) {
    var service = {
      uploadFileToBrowser: uploadFileToBrowser
    };
    var originalRecords;
    var originalHeader;
    var newHeader;
    var newHeader_id;

    return service;

    ////////////////
    function uploadFileToBrowser(file) {
      return readFile(file)
        .then(checkHeaderMapping)
        .then(replaceHeadersAndParse);
    }

    function readFile(file) {
      return FileParser.readFile(file);
    }

    function checkHeaderMapping(parsed) {
      originalHeader = parsed[0];
      originalRecords = parsed.slice(1, parsed.length - 1);

      return HeaderService.checkHeader(originalHeader);
    }

    function replaceHeadersAndParse(headerInfo) {
      if (!headerInfo.match) {
        return {
          isMatch: false,
          originalRecords: originalRecords,
          originalHeader: originalHeader
        };
      } else {
        newHeader = headerInfo.header.header;
        newHeader_id = headerInfo.header.headerObj._id;

        originalRecords[0] = newHeader;

        return FileParser.convertCsvRecordsToJson(
          originalRecords
        ).then(function(records) {
          return {
            isMatch: true,
            records: records,
            header: newHeader,
            header_id: newHeader_id
          };
        });
      }
    }
  }
})();
