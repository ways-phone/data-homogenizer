(function() {
  "use strict";

  angular.module("core").factory("ClientService", ClientService);

  ClientService.$inject = [
    "$window",
    "$http",
    "$resource",
    "$q",
    "GeneralFuncService",
    "ResponseHandler"
  ];

  function ClientService(
    $window,
    $http,
    $resource,
    $q,
    GeneralFuncService,
    ResponseHandler
  ) {
    var resource = $resource(
      "/api/clients",
      {},
      {
        update: {
          method: "PUT"
        }
      }
    );

    return {
      addClient: addClient,
      receiveClients: receiveClients,
      removeClient: removeClient,
      updateClient: updateClient
    };

    // posts the new client to the server and saves it
    function addClient(client) {
      var deferred = $q.defer();
      var newClient = new resource(client);

      var handleResponse = ResponseHandler(deferred);
      newClient.$save(handleResponse);
      return deferred.promise;
    }

    // queries the db and receives all clients
    function receiveClients() {
      var deferred = $q.defer();
      var handleResponse = ResponseHandler(deferred);

      resource.get(handleResponse);

      return deferred.promise;
    }

    // deletes the client from the db
    function removeClient(_id) {
      var deferred = $q.defer();
      var handleResponse = ResponseHandler(deferred);

      resource.delete(
        {
          _id: _id
        },
        handleResponse
      );

      return deferred.promise;
    }

    // posts the updated client to the server
    function updateClient(client) {
      var deferred = $q.defer();
      var handleResponse = ResponseHandler(deferred);
      var updatedClient = new resource(client);

      resource.update(client, handleResponse);

      return deferred.promise;
    }
  }
})();
