(function () {
  'use strict';

  angular
    .module('regex-toolbox', [
      // Angular modules
      'ngAnimate',
      'ngMaterial',

      // Third-party modules
      'ui.router',
      'pascalprecht.translate',
      'ngLodash',

      // App modules
      'regex-toolbox.constants',
      'file-rename',
      'input-folder'
    ]);

})();
