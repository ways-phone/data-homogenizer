"use strict";

angular.module(
  ApplicationConfiguration.applicationModuleName,
  ApplicationConfiguration.applicationModuleVendorDependencies
);

angular.module(ApplicationConfiguration.applicationModuleName).config([
  "$locationProvider",
  function($locationProvider) {
    $locationProvider.hashPrefix("!");
  }
]);

if (window.location.hash === "#_=_") window.location.hash = "#!";

angular.element(document).ready(function() {
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
