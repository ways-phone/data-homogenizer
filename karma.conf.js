'use strict';
// Karma configuration
// Generated on Thu Jun 29 2017 14:00:46 GMT+1000 (AEST)

module.exports = function ( config ) {
    config.set( {

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: [ 'mocha', 'chai', 'sinon' ],


        // list of files / patterns to load in the browser
        files: [

            'public/bower_components/angular/angular.js',

            'public/bower_components/angular-route/angular-route.js',
            'public/bower_components/angular-resource/angular-resource.js',
            'public/bower_components/angular-animate/angular-animate.js',
            'public/bower_components/angularUtils-pagination/dirPagination.js',
            'public/bower_components/isteven-angular-multiselect/isteven-multi-select.js',
            'public/bower_components/angular-animate/angular-animate.min.js',
            'public/bower_components/angular-sanitize/angular-sanitize.js',
            'public/bower_components/ng-csv/build/ng-csv.min.js',
            'public/bower_components/js-xlsx/dist/xlsx.core.min.js',
            'public/bower_components/js-xlsx/dist/jszip.js',
            'public/bower_components/papaparse/papaparse.js',
            'public/bower_components/angular-papaparse/dist/js/angular-PapaParse.js',
            'public/bower_components/ng-file-upload/ng-file-upload.js',
            'public/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',

            'public/bower_components/angular-mocks/angular-mocks.js',
            'modules/core/client/app/config.js',
            'modules/core/client/app/init.js',
            'modules/*/client/*.module.js',
            'modules/*/client/services/*.js',
            'modules/*/client/controllers/*.js',

            'modules/*/client/config/*.js',

            'modules/*/client/tests/*.spec.js',


        ],


        // list of files to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {},


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter

        reporters: [ "spec" ],
        specReporter: {
            maxLogLines: 5, // limit number of lines logged per test
            suppressErrorSummary: true, // do not print error summary
            suppressFailed: false, // do not print information about failed tests
            suppressPassed: false, // do not print information about passed tests
            suppressSkipped: true, // do not print information about skipped tests
            showSpecTiming: false // print the time elapsed for each spec
        },


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: [ 'PhantomJS' ],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    } )
}