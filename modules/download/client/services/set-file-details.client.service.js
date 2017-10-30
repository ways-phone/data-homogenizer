(function() {
  "use strict";

  angular.module("download").factory("DownloadFileService", Service);

  Service.$inject = ["DateFormat"];

  function Service(DateFormat) {
    var headers;
    var states = ["isDuplicate", "isDuplicateWithinFile", "isInvalid"];
    var service = {
      prepareFileForDownload: prepareFileForDownload
    };

    return service;

    ////////////////

    function prepareFileForDownload(config) {
      var headers = determineHeaders(config.recordStates);
      var filename = setFileName();

      // setQueryWithRecordstates();

      return {
        headers: headers,
        filename: filename
      };

      ////////////////////////////

      function determineHeaders(recordStates) {
        headers = [
          "CustKey",
          "Phone1",
          "Phone2",
          "DOB",
          "Gender",
          "Title",
          "FirstName",
          "LastName",
          "Address1",
          "Address2",
          "Suburb",
          "State",
          "Postcode",
          "Email",
          "MobilePhone",
          "HomePhone",
          "SiteLabel",
          "Source",
          "Client",
          "Campaign",
          "File",
          "List"
        ];

        addRecordStatesToHeaders();
        return headers;

        ////////////////////////

        function addRecordStatesToHeaders() {
          var stateSelected = false;

          if (!recordStates) return;

          Object.keys(recordStates).forEach(addStateIfTrue);

          if (!stateSelected) {
            states.forEach(addAllStatesIfNothingSelected);
          }

          ////////////////////

          function addStateIfTrue(key) {
            var bool = recordStates[key];
            if (bool) {
              if (key !== "isClean") {
                headers.push(key);
              }
              stateSelected = true;
            }
          }

          function addAllStatesIfNothingSelected(state) {
            headers.push(state);
          }
        }
      }

      function setFileName() {
        var filename;
        setDateRange();
        DetermineNameChoice();
        return filename;

        ///////////////////////

        function setDateRange() {
          if (!!config.start && !!config.end) {
            config.start.setHours(0, 0, 0, 0);
            config.end.setHours(23, 59, 59, 59);
          }
        }

        function DetermineNameChoice() {
          // console.log( config.downloadType );
          if (config.downloadType.byFile) {
            createFileDownloadName();
          } else if (config.downloadType.byCampaign) {
            createCampaignDownloadName();
          } else if (config.downloadType.byList) {
            createListDownloadName();
          } else {
            createSourceDownloadName();
          }

          ////////////////////////

          function createFileDownloadName() {
            filename =
              stripFileName(config.file.Name) +
              " " +
              getDownloadFilenameType() +
              ".csv";
          }

          function createCampaignDownloadName() {
            filename =
              config.client.Acronym +
              " " +
              config.campaign.Name +
              " " +
              DateFormat.fileDate(config.start) +
              "-" +
              DateFormat.fileDate(config.end) +
              " " +
              getDownloadFilenameType() +
              ".csv";
          }

          function createListDownloadName() {
            filename =
              config.list.Name + " " + getDownloadFilenameType() + ".csv";
          }

          function createSourceDownloadName() {
            filename =
              config.client.Acronym +
              " " +
              config.campaign.Name +
              " - " +
              config.source.DisplayName +
              " " +
              DateFormat.fileDate(config.start) +
              "-" +
              DateFormat.fileDate(config.end) +
              " " +
              getDownloadFilenameType() +
              ".csv";
          }

          function stripFileName(filename) {
            return filename
              .replace(".csv", "")
              .replace(".xlsx", "")
              .replace(".xls", "")
              .replace(".xlsm", "");
          }

          function getDownloadFilenameType() {
            var type = [];
            if (!config.recordStates) {
              type = ["Clean"];
            } else {
              // Object.keys( config.recordStates ).forEach( addtypeToArrayIfTrue );
              type = ["All"];
            }

            return formatTypeArr();
            //////////////////

            function addtypeToArrayIfTrue(key) {
              var bool = config.recordStates[key];
              if (bool) {
                type.push(key);
              }
            }

            function formatTypeArr() {
              if (type.length > 0) {
                return "(" + type.join("_") + ")";
              } else {
                return "(All)";
              }
            }
          }
        }
      }

      function setQueryWithRecordstates() {
        var status = {};
        console.log("config: ", config);
        if (config.recordStates.isClean) {
          status = {
            isInvalid: false,
            isDuplicate: false,
            isDuplicateWithinFile: false
          };
        } else if (
          config.recordStates.isDuplicate ||
          config.recordStates.isDuplicateWithinFile
        ) {
          status.$or = {
            isDuplicate: config.recordStates.isDuplicate,
            isDuplicateWithinFile: config.recordStates.isDuplicateWithinFile
          };
        } else if (config.downloadType.byList) {
          status = {};
        } else {
          status = {};
        }
        status.Campaign = config.campaign._id;
        Object.assign(config.query, status);
        console.log("status: ", status);
        console.log("query: ", config.query);
      }
    }
  }
})();
