(function () {
  'use strict';

  var fs = require('fs'),
    path = require('path');

  angular
    .module('file-rename.component', [])
    .component('fileRename', {
      templateUrl: 'file-rename/file-rename.html',
      bindings: {},
      controller: FileRenameController,
      controllerAs: 'vm'
    });

  function FileRenameController($scope) {
    var vm = this;

    vm.dirs = [];

    activate();

    ///////////

    function activate() {
      fs.readdir('.', function (err, files) {
        if (err) {
          console.log(err);
        }
        vm.dirs = files;
        $scope.$apply();
      });
    }

  }
})();
