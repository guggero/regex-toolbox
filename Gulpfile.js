'use strict';

var childProcess = require('child_process');
var electron = require('electron-prebuilt');
var gulp = require('gulp');
var jetpack = require('fs-jetpack');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var os = require('os');
var release_windows = require('./build.windows');
var inject = require('gulp-inject');
var wiredep = require('wiredep').stream;
var angularFilesort = require('gulp-angular-filesort');
var watch = require('gulp-watch');
var install = require('gulp-install');

var projectDir = jetpack;
var destDir = projectDir.cwd('./build');

// -------------------------------------
// Tasks
// -------------------------------------

gulp.task('npm-install', function () {
  return gulp.src(['./app/package.json'])
    .pipe(install());
});

gulp.task('clean', ['npm-install'], function () {
  return destDir.dirAsync('.', {empty: true});
});

gulp.task('scripts', ['copy-app'], function () {
  var jsSources = gulp.src([
    './**/*.js',
    '!./main.js',
    '!./node_modules/**/*.js'
  ], {cwd: __dirname + '/app/'})
    .pipe(angularFilesort())
    .on('error', function (err) {
      console.log(err.toString());
      this.emit('end');
    });
  var cssSources = gulp.src([
    './**/*.css'
  ], {cwd: __dirname + '/app/'});

  return gulp.src('./app/index.html')
    .pipe(inject(jsSources, {addRootSlash: false}))
    .pipe(inject(cssSources, {addRootSlash: false}))
    .pipe(gulp.dest('./build'));
});

gulp.task('copy-app', ['clean'], function () {
  return projectDir.copyAsync('app', destDir.path(), {
    overwrite: true
  });
});

gulp.task('copy-assets', ['clean'], function () {
  return projectDir.copyAsync('assets', destDir.path(), {
    overwrite: true
  });
});

gulp.task('copy-bower', ['clean'], function () {
  return projectDir.copyAsync('bower_components', destDir.path() + '/bower_components', {
    overwrite: true
  });
});

gulp.task('build', ['scripts', 'copy-assets', 'copy-bower'], function () {

  return gulp.src('./build/index.html')
    .pipe(wiredep({directory: 'build/bower_components', ignorePath: '../'}))
    .pipe(gulp.dest('build'))
    .on('error', function (err) {
      console.log(err.toString());
      this.emit('end');
    });
});

gulp.task('run', ['build'], function () {
  watch(['app/**/*.*', '!app/index.html'])
    .pipe(gulp.dest('build'));

  childProcess.spawn(electron, ['./build'], {stdio: 'inherit'});
});

gulp.task('build-electron', ['build'], function () {
  switch (os.platform()) {
    case 'darwin':
      // execute build.osx.js
      break;
    case 'linux':
      //execute build.linux.js
      break;
    case 'win32':
      return release_windows.build();
  }
});
