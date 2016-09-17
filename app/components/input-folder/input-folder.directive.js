(function () {
  'use strict';

  angular
    .module('input-folder', [])
    .directive('inputFolder', function () {
      return {
        templateUrl: 'components/input-folder/input-folder.html',
        scope: {
          ngModel: '=',
          onChange: '&'
        },
        link: inputFolderLink
      }
    });

  function inputFolderLink(scope, element) {
    var input = element.find('input[type=file]');
    var button = element.find('button');
    var textInput = element.find('input[type=text]');

    function selectFolder() {
      input.click();
    }

    if (input.length && button.length && textInput.length) {
      button.click(selectFolder);
      textInput.click(selectFolder);
    }

    input.on('change', function (e) {
      var files = e.target.files;
      if (files[0]) {
        scope.fileName = files[0].path;
      } else {
        scope.fileName = null;
      }
      scope.ngModel = files[0];
      scope.$apply();
      scope.onChange();
      scope.$apply();
    });
  }
})();
