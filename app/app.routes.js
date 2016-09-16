(function () {
  'use strict';

  angular
    .module('regex-toolbox')
    .config(appConfig);

  function appConfig($stateProvider) {

    $stateProvider
      .state('fileRename', {
        url: '/',
        template: '<file-rename></file-rename>'
      })
      .state('tester', {
        url: '/tester',
        template: '<tester></tester>'
      });
  }

})();
