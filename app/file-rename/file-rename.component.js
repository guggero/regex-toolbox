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

  function FileRenameController(fs, path, dialog, lodash) {
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
        try {
          var files = fs.readdirSync(basePath);
          if (vm.listRecursive) {
            vm.files = [];
            walkDir(vm.files, files, basePath);
          } else {
            files = filterFiles(basePath, files);
            vm.files = relativePath(files, basePath);
          }
        } catch (e) {
          dialog.showErrorBox('', (e && e.message) || e);
        }
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

    function walkDir(target, files, basePath) {
      // push all files to target
      target.push(...relativePath(filterFiles(basePath, files), basePath));

      // get directories and walk every one of them
      var dirs = filterDirs(basePath, files);
      lodash.forEach(dirs, function (dir) {
        var fullDir = path.resolve(basePath, dir);
        walkDir(target, fs.readdirSync(fullDir), fullDir);
      });
    }

    function filterFiles(basePath, files) {
      return lodash.filter(files, function (file) {
        var fsFile = path.resolve(basePath, file);
        var stat = fs.statSync(fsFile);
        return stat && stat.isFile();
      });
    }

    function filterDirs(basePath, files) {
      return lodash.filter(files, function (file) {
        var fsFile = path.resolve(basePath, file);
        var stat = fs.statSync(fsFile);
        return stat && stat.isDirectory();
      });
    }

    function relativePath(files, containingDirectory) {
      return lodash.map(files, function (file) {
        var relativePath = path.relative(vm.baseDir.path, containingDirectory);
        return {
          name: file,
          path: relativePath == '' ? '' : relativePath + path.sep
        };
      });
    }
  }

})();
