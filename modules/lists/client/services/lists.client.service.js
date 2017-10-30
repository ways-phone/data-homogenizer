(function() {
  "use strict";

  angular.module("list").factory("ListService", ListService);

  ListService.$inject = ["$routeParams", "$q", "$resource"];

  function ListService($routeParams, $q, $resource) {
    var resource = $resource("/api/:acronym/:path/lists", {
      acronym: "@Acronym",
      path: "@Path"
    });
    var service = {
      sendRecordCountRequest: sendRecordCountRequest,
      sendCreateListRequest: sendCreateListRequest,
      retrieveExistingLists: retrieveExistingLists,
      sendDeleteRequest: sendDeleteRequest
    };

    return service;

    ////////// Get Record Numbers ////////////////

    function sendRecordCountRequest(query) {
      var deferred = $q.defer();
      formatQueryForAggregation();

      var route = angular.copy($routeParams);
      route.data = query;

      resource.get(route, function(response) {
        if (!!response.error) {
          deferred.reject(response.error);
        } else {
          deferred.resolve(response.data);
        }
      });
      return deferred.promise;

      ///////////////////////

      function formatQueryForAggregation() {
        createAggregateGroups();
        createAggregateLookups();

        /////////////////////////

        function createAggregateGroups() {
          var group = query.$group;
          var updated = {};

          Object.keys(group).forEach(convertKeysToGroupKeys);

          query.$group = updated;
          /////////////////////

          function convertKeysToGroupKeys(key) {
            if (group[key]) updated[key] = "$" + key;
          }
        }

        function createAggregateLookups() {
          if (query.$group.Source) {
            query.lookup1 = {
              from: "sources",
              localField: "_id.Source",
              foreignField: "_id",
              as: "_id.Source"
            };

            query.unwind1 = "$_id.Source";
            query.project1 = {
              _id: 0
            };
          }
          if (query.$group.File) {
            query.lookup2 = {
              from: "files",
              localField: "_id.File",
              foreignField: "_id",
              as: "_id.File"
            };

            query.unwind2 = "$_id.File";
          }
        }
      }
    }

    ///////////// Create New List ////////////////

    function sendCreateListRequest(query) {
      var deferred = $q.defer();

      var list = new resource(query);
      list.$save($routeParams, function(response) {
        if (response.error) {
          deferred.reject(response.error);
        } else {
          deferred.resolve(response.data);
        }
      });

      return deferred.promise;
    }

    //////////// Retrieve Existing Lists //////////

    function retrieveExistingLists() {
      var listResource = $resource("/api/:acronym/:path/view-lists", {
        acronym: "@Acronym",
        path: "@Path"
      });

      var deferred = $q.defer();
      listResource.get($routeParams, function(response) {
        if (response.error) {
          deferred.reject(response.error);
        } else {
          deferred.resolve(response.data);
        }
      });
      return deferred.promise;
    }

    /////////// Delete List //////////////////////

    function sendDeleteRequest(id) {
      var deferred = $q.defer();
      var route = angular.copy($routeParams);
      route.data = id;

      resource.delete(route, function(response) {
        if (response.error) {
          deferred.reject(response.error);
        } else {
          deferred.resolve(response.data);
        }
      });
      return deferred.promise;
    }
  }
})();
