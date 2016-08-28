(function () {
  'use strict';

  angular.module('regex-toolbox', [
    'ngRoute',
    'ngMaterial',
    'ngAnimate',

    'file-rename'
  ])
    .config(appConfig);

  function appConfig($routeProvider) {
    $routeProvider.when('/', {
      template: '<file-rename></file-rename>',
    });
    $routeProvider.otherwise({redirectTo: '/'});
  }

})();
