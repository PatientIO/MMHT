var gulp = require('gulp');
var gutil = require('gulp-util');
var args = require('yargs').argv;

var mmhtConfig = require("./mmhtConfig.json");

var clean = require('./lib/clean');
var compile = require("./lib/compile");
var update = require("./lib/update");
var test = require("./lib/test");
var pull = require("./lib/pull");

if (args.lang) {
    mmhtConfig.HANDLEBARS_KEY = args.lang;
}

gulp.task('default', function () {
    // Default task code
    gutil.log('-------------------------------------------------------');
    gutil.log('------------- ', gutil.colors.red('Warning Experimental Tool'), '--------------');
    gutil.log('-------------------------------------------------------');

    gutil.log(gutil.colors.magenta('gulp clean  '), ' -- removes all *.mc.html files (mailchimp ready templates)');
    gutil.log(gutil.colors.magenta('gulp compile --lang zh'), ' -- builds your templates (defaults to en).');
    gutil.log(gutil.colors.magenta('gulp update '), ' -- pushes your templates to mandrill.');
    gutil.log(gutil.colors.magenta('gulp pull   '), ' -- download current templates from mandrill and format them.');
    gutil.log(gutil.colors.magenta('gulp test   '), ' -- sends you a test email from mandrill.');
    gutil.log('-------------------------------------------------------');
});

gulp.task('clean', function () {
    clean(mmhtConfig);
});

gulp.task('compile', ['clean'], function () {
    compile(mmhtConfig);
});

gulp.task('update', function () {
    update(mmhtConfig);
});

gulp.task('test', function () {
    test(mmhtConfig);
});

gulp.task('pull', ['clean'], function () {
    pull(mmhtConfig);
});

