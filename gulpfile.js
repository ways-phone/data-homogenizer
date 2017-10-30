'use strict';

var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var nodemon = require('gulp-nodemon');

gulp.task('css', function () {
    gulp
        .src(['public/css/*.css', 'public/bower_components/isteven-angular-multiselect/isteven-multi-select.css'])
        .pipe(concat('public/css/all.css'))
        .pipe(gulp.dest('.'));
});

gulp.task('js', function () {
    gulp
        .src([
        'public/bower_components/jquery/dist/jquery.min.js',
        'public/bower_components/bootstrap/dist/js/bootstrap.min.js',
        'public/bower_components/angular/angular.min.js',
        'public/bower_components/angular-route/angular-route.min.js',
        'public/bower_components/angular-resource/angular-resource.min.js',

        'public/bower_components/angularUtils-pagination/dirPagination.js',
        'public/bower_components/isteven-angular-multiselect/isteven-multi-select.js',
        'public/bower_components/angular-sanitize/angular-sanitize.min.js',
        'public/bower_components/ng-csv/build/ng-csv.min.js',
        'public/bower_components/js-xlsx/dist/xlsx.core.min.js',
        'public/bower_components/js-xlsx/dist/jszip.js',
        'public/bower_components/papaparse/papaparse.js',
        'public/bower_components/angular-papaparse/dist/js/angular-PapaParse.js',
        'public/bower_components/ng-file-upload/ng-file-upload.min.js',
        'public/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
        'modules/core/client/app/config.js',
        'modules/core/client/app/init.js',
        'modules/core/client/core.client.module.js',
        'modules/campaigns/client/campaigns.client.module.js',
        'modules/**/client/**/*.js'
    ])
        .pipe(concat('/public/app.js'))
        .pipe(uglify())
        .pipe(gulp.dest('.'));
});

gulp.task('develop', function () {
    var stream = nodemon({script: 'server.js', ext: 'html js ', ignore: ['ignored.js'], tasks: ['js']});

    stream.on('restart', function () {
        console.log('restarted!')
    })
        .on('crash', function () {
            console.error('Application has crashed!\n')
            stream.emit('restart', 10) // restart the server in 10 seconds
        })
})
gulp.task('watch', ['js'], function () {
    gulp.watch('modules/**/client/**/*.js', ['js']);
});