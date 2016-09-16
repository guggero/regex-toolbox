(function () {
  'use strict';

  const electron = require('electron').remote;
  const jquery = window.$ || window.jQuery || require('jquery');
  const fs = require('fs');
  const path = require('path');

  angular
    .module('regex-toolbox')
    .constant('fs', fs)
    .constant('path', path)
    .constant('jquery', jquery)
    .constant('dialog', electron.dialog)
    .config(appConfig);

  function appConfig($logProvider, $urlRouterProvider, $translateProvider) {

    $logProvider.debugEnabled(true);
    $urlRouterProvider.otherwise('/');

    // configure translation service
    $translateProvider.preferredLanguage('en');
    $translateProvider.useSanitizeValueStrategy('escapeParameters');
    $translateProvider.useStaticFilesLoader({
      prefix: 'i18n/messages_',
      suffix: '.json'
    });
  }

})();
