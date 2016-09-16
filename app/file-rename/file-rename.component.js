(function () {
  'use strict';

  angular
    .module('file-rename.component', [])
    .component('fileRename', {
      templateUrl: 'file-rename/file-rename.html',
      bindings: {},
      controller: FileRenameController,
      controllerAs: 'vm'
    });

  function FileRenameController($scope, fs, dialog) {
    var vm = this;

    vm.dirs = [];
    vm.treeConfig = {
      core: {
        multiple: false,
        animation: true,
        error: function (error) {
          dialog.showErrorBox('', error);
        }
      }
    };

    vm.treeData = [
      {id: 'ajson1', parent: '#', text: 'Simple root node'},
      {id: 'ajson2', parent: '#', text: 'Root node 2'},
      {id: 'ajson3', parent: 'ajson2', text: 'Child 1'},
      {id: 'ajson4', parent: 'ajson2', text: 'Child 2'}
    ];

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
