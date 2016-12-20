'use strict';

let path = require('path');
let wiredep = require('wiredep');

let srcPath = 'app';

function listFiles() {

  let wiredepOptions = {
    directory: 'bower_components',
    dependencies: true,
    devDependencies: true
  };

  return wiredep(wiredepOptions).js
    .concat([
      path.join(srcPath, '/app.constants.js'),
      path.join(srcPath, '/**/*.module.js'),
      path.join(srcPath, '/**/!(main).js'),
      path.join(srcPath, '/**/*.spec.js'),
      path.join(srcPath, '/**/*.mock.js'),
      path.join(srcPath, '/**/*.html')
    ]);
}

module.exports = function (config) {
  config.set({

    angularFilesort: {
      whitelist: [path.join(srcPath, '/**/!(*.html|*.spec|*.mock).js')]
    },

    browsers: ['Electron'],

    client: {
      useIframe: false
    },

    files: listFiles(),

    frameworks: ['jasmine', 'angular-filesort'],

    plugins: [
      'karma-angular-filesort',
      'karma-electron',
      'karma-jasmine'
    ],

    preprocessors: {
      '**/*.js': ['electron']
    },

    reporters: ['progress'],
  });
};
