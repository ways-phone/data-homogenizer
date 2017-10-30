"use strict";

var ApplicationConfiguration = (function() {
  var applicationModuleName = "data-uploader";
  var applicationModuleVendorDependencies = [
    "ngResource",
    "ngRoute",
    "ui.bootstrap",
    "ngFileUpload",
    "ngPapaParse",
    // 'ngTable',
    "isteven-multi-select",
    "ngAnimate",
    "ngCsv",
    // 'infinite-scroll',
    "angularUtils.directives.dirPagination"
  ];

  var registerModule = function(moduleName, dependencies) {
    angular.module(moduleName, dependencies || []);

    angular.module(applicationModuleName).requires.push(moduleName);
  };

  return {
    applicationModuleName: applicationModuleName,
    applicationModuleVendorDependencies: applicationModuleVendorDependencies,
    registerModule: registerModule
  };
})();
