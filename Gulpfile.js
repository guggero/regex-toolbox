'use strict';

var childProcess = require('child_process');
var electron = require('electron-prebuilt');
var gulp = require('gulp');
var jetpack = require('fs-jetpack');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var os = require('os');
var inject = require('gulp-inject');
var wiredep = require('wiredep').stream;
var babel = require('gulp-babel');
var angularFilesort = require('gulp-angular-filesort');
var watch = require('gulp-watch');
var packager = require('electron-packager');
var pkg = require('./package.json');
var copyDeps = require('gulp-npm-copy-deps');
var envs = require('gulp-environments');
var zip = require('gulp-zip');

var projectDir = jetpack;
var destDir = projectDir.cwd('./build');
var distDir = projectDir.cwd('./dist');

// -------------------------------------
// Tasks
// -------------------------------------

gulp.task('clean', [], function () {
  return destDir.dirAsync('.', {empty: true});
});

gulp.task('clean-dist', [], function () {
  return distDir.dirAsync('.', {empty: true});
});

gulp.task('copy-npm-deps', ['clean'], function () {

  var starterPackageJson = {
    name: pkg.name,
    version: pkg.version,
    production: envs.production(),
    main: "main.js"
  };

  jetpack.write('./build/package.json', starterPackageJson);

  return copyDeps('./', './build');
});

gulp.task('scripts', ['copy-app', 'copy-npm-deps'], function () {
  var jsSources = gulp.src([
    './**/*.js',
    '!./main.js',
    '!./node_modules/**/*.js'
  ], {cwd: __dirname + '/app/'})
    .pipe(babel({
      presets: ['es2015']
    }))
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
  watch([
    'app/**/*.*',
    'assets/**/*.*',
    '!app/index.html'
  ]).pipe(gulp.dest('build'));

  return childProcess.spawn(electron, ['./build'], {stdio: 'inherit'});
});
gulp.task('build-electron', ['clean-dist', 'build'], function (done) {
  return packager({
    dir: 'build',
    all: 'true',
    'app-copyright': '© ' + (new Date()).getFullYear() + ' ' + pkg.author.name,
    out: 'dist',
    prune: false
  }, function (err, appPaths) {
    if (err) {
      console.error(err);
    }
    console.log('Created directories ' + appPaths);
    done();
  });
});

gulp.task('package', ['build-electron'], function () {
  jetpack.list('dist').forEach(function (dir) {
    gulp.src('dist/' + dir + '/*')
      .pipe(zip(dir + '.zip'))
      .pipe(gulp.dest('dist'));
  });
});
