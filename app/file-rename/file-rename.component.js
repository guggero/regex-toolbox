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

  function FileRenameController() {
    var vm = this;

    activate();

    ///////////

    function activate() {
      vm.test = 'bla';
    }

  }
})();
