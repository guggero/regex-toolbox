(function () {
  'use strict';

  angular
    .module('regex-toolbox')
    .config(appConfig);

  function appConfig($stateProvider) {
    $stateProvider
      .state('index', {
        url: '/',
        template: '<file-rename></file-rename>'
      });
  }

})();
