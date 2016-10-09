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

  function FileRenameController(fs, path, dialog, lodash, fileRenameService) {
    var vm = this;

    vm.updatePreview = updatePreview;
    vm.startReplace = startReplace;

    ///////////

    function updatePreview(dirChanged) {
      if (!vm.baseDir || !vm.baseDir.path) {
        vm.files = [];
        return;
      }

      var basePath = vm.baseDir.path;

      if (dirChanged) {
        //try {
        vm.files = fileRenameService.listFilesRelativeToPath(basePath, vm.listRecursive);
        /*} catch (e) {
         dialog.showErrorBox('', (e && e.message) || e);
         console.error(e);
         }*/
      }

      if (validPattern(vm.matchPattern)) {
        var pattern = new RegExp(vm.matchPattern, vm.caseInsensitive ? 'i' : '');
        lodash.forEach(vm.files, function (file) {
          file.matched = pattern.test(file.name);
          if (file.matched && vm.replacePattern) {
            file.preview = file.name.replace(pattern, vm.replacePattern);
          } else {
            file.preview = file.name;
          }
        });
      } else {
        lodash.forEach(vm.files, function (file) {
          file.matched = false;
          file.preview = file.name;
        })
      }
    }

    function startReplace() {
      var basePath = vm.baseDir.path;

      lodash.forEach(vm.files, function (file) {
        if (file.matched) {
          var oldPath = path.resolve(basePath, file.path, file.name);
          var newPath = path.resolve(basePath, file.path, file.preview);
          console.log('Renaming ' + oldPath + ' to ' + newPath);
          fs.renameSync(oldPath, newPath);
        }
      });
    }

    function validPattern(pattern) {
      if (pattern && pattern.length) {
        try {
          new RegExp(pattern);
          return true;
        } catch (e) {
          return false;
        }
      }
      return false;
    }
  }
})();
