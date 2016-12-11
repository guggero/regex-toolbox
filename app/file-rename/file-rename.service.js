(function () {
  'use strict';

  angular
    .module('file-rename.service', [
      'ngLodash',
      'regex-toolbox.constants'
    ])
    .factory('fileRenameService', fileRenameService);

  function fileRenameService(fs, path, lodash) {
    return {
      listFilesRelativeToPath: listFilesRelativeToPath,
      getFilesOnly: getFilesOnly,
      getDirsOnly: getDirsOnly
    };

    //////////////////////////

    function listFilesRelativeToPath(basePath, listRecursive) {
      let target = null;
      let files = fs.readdirSync(basePath);
      if (listRecursive) {
        target = [];
        walkDir(target, files, basePath, basePath);
      } else {
        files = getFilesOnly(basePath, files);
        target = relativePath(basePath, files, basePath);
      }
      return target;
    }

    function walkDir(target, files, currentPath, rootPath) {
      // push all files to target
      target.push(...relativePath(rootPath, getFilesOnly(currentPath, files), currentPath));

      // get directories and walk every one of them
      let dirs = getDirsOnly(currentPath, files);
      lodash.forEach(dirs, function (dir) {
        let fullDir = path.resolve(currentPath, dir);
        walkDir(target, fs.readdirSync(fullDir), fullDir, rootPath);
      });
    }

    function relativePath(rootPath, files, containingDirectory) {
      return lodash.map(files, function (file) {
        let relativePath = path.relative(rootPath, containingDirectory);
        return {
          name: file,
          path: relativePath == '' ? '' : relativePath + path.sep
        };
      });
    }

    function getFilesOnly(basePath, files) {
      return filterByStat(basePath, files, 'isFile');
    }

    function getDirsOnly(basePath, files) {
      return filterByStat(basePath, files, 'isDirectory');
    }

    function filterByStat(basePath, files, statFn) {
      return lodash.filter(files, function (file) {
        let fsFile = path.resolve(basePath, file);
        let stat = fs.statSync(fsFile);
        return stat && stat[statFn]();
      });
    }
  }
})();
