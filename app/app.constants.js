(function () {
  'use strict';

  const electron = require('electron').remote;
  const jquery = window.$ || window.jQuery || require('jquery');
  const fs = require('fs');
  const path = require('path');

  angular
    .module('regex-toolbox.constants', [])
    .constant('fs', fs)
    .constant('path', path)
    .constant('jquery', jquery)
    .constant('dialog', electron.dialog);

})();
