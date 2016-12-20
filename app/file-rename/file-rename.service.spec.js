(function () {
  'use strict';

  describe('file-rename.service', function () {

    let fileRenameService;

    beforeEach(function () {
      module('file-rename.service');

      inject(function ($injector) {
        fileRenameService = $injector.get('fileRenameService');
      });
    });

    describe('service', function () {
      it('should expose the correct functions', function () {
        expect(fileRenameService.listFilesRelativeToPath).toBeDefined();
      });
    })
  });
})();
