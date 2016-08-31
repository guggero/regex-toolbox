(function () {
  'use strict';

  angular
    .module('regex-toolbox')
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
