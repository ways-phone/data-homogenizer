(function() {
  "use strict";

  angular.module("auth").service("authentication", authentication);

  authentication.$inject = ["$http", "$location", "$q", "$resource", "$window"];

  function authentication($http, $location, $q, $resource, $window) {
    activate();

    return {
      saveToken: saveToken,
      getToken: getToken,
      logout: logout,
      isLoggedIn: isLoggedIn,
      register: register,
      login: login,
      authenticate: authenticate,
      currentUser: currentUser,
      setAuth: setAuth
    };

    function activate() {
      $http.defaults.headers.common.Authorization = setAuth();
    }
    ////////////////

    function saveToken(token) {
      $window.localStorage["db-token"] = token;
    }

    function getToken() {
      return $window.localStorage["db-token"];
    }

    function logout() {
      delete $window.localStorage["db-token"];

      $window.location.href = "/#!/login";
      $window.location.reload();
    }

    function isLoggedIn() {
      var token = getToken();
      var payload;

      if (token) {
        payload = token.split(".")[1];
        payload = $window.atob(payload);
        payload = JSON.parse(payload);
        return payload.exp > Date.now() / 1000;
      } else {
        return false;
      }
    }

    function currentUser() {
      if (isLoggedIn()) {
        var token = getToken();
        var payload = token.split(".")[1];
        payload = $window.atob(payload);
        payload = JSON.parse(payload);
        return { _id: payload._id, name: payload.name };
      }
    }

    function register(user) {
      var deferred = $q.defer();
      var resource = $resource("/api/register");
      var User = new resource(user);

      User.$save(function(response) {
        if (response.error) {
          deferred.reject(response.error);
        } else {
          saveToken(response.data);
          deferred.resolve();
        }
      });

      return deferred.promise;
    }

    function login(user) {
      var deferred = $q.defer();
      var resource = $resource("/api/login");
      var User = new resource(user);

      User.$save(function(response) {
        if (response.error) {
          deferred.reject(response.error);
        } else {
          saveToken(response.data);
          deferred.resolve();
        }
      });

      return deferred.promise;
    }

    function authenticate() {
      if (!isLoggedIn()) {
        console.log("redirecting");
        $location.path("/login");
      }
      return true;
    }

    function setAuth() {
      var token = getToken();
      if (token) {
        return "Bearer " + token;
      } else {
        return "";
      }
    }
  }
})();
