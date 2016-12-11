'use strict';

let childProcess = require('child_process');
let electron = require('electron-prebuilt');
let gulp = require('gulp');
let jetpack = require('fs-jetpack');
let usemin = require('gulp-usemin');
let uglify = require('gulp-uglify');
let os = require('os');
let inject = require('gulp-inject');
let wiredep = require('wiredep').stream;
let babel = require('gulp-babel');
let angularFilesort = require('gulp-angular-filesort');
let watch = require('gulp-watch');
let packager = require('electron-packager');
let pkg = require('./package.json');
let copyDeps = require('gulp-npm-copy-deps');
let envs = require('gulp-environments');
let zip = require('gulp-zip');

let projectDir = jetpack;
let destDir = projectDir.cwd('./build');
let distDir = projectDir.cwd('./dist');

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

  let starterPackageJson = {
    name: pkg.name,
    version: pkg.version,
    production: envs.production(),
    main: "main.js"
  };

  jetpack.write('./build/package.json', starterPackageJson);

  return copyDeps('./', './build');
});

gulp.task('scripts', ['copy-app', 'copy-npm-deps'], function () {
  let jsSources = gulp.src([
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
  let cssSources = gulp.src([
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
