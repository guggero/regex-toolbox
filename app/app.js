(function () {
  'use strict';

  var jquery = window.jQuery = require('jquery');

  angular
    .module('regex-toolbox', [
      // Angular modules
      'ngAnimate',
      'ngMaterial',

      // Third-party modules
      'ui.router',
      'pascalprecht.translate',

      // App modules
      'file-rename'
    ]);

})();
