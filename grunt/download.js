// @note: holding onto this task to support downloading different OS versions for x-env builds
'use strict';
var downloadConfig = require('./download-electron.js')();
var fs = require('fs');

// download is a proxy to task download-electron, conditionally
module.exports = function(grunt) {
    grunt.registerTask('download', 'download electron', function() {
        var ePath = './' + downloadConfig.outputDir + '/version';
        var downloadRequired = true;
        var version, versionMatched;

        grunt.log.writeln('Testing for electron in: "' + ePath + '"');

        // determine if we must download the electron app
        if (fs.existsSync(ePath)) {
            version = fs.readFileSync(ePath, {encoding: 'utf8'});
            versionMatched = version.match(downloadConfig.version);
            if (versionMatched) {
                downloadRequired = false;
            }
        }

        if (downloadRequired) {
            if (version) {
                grunt.log.writeln('Electron version mismatch: Installed - ' +
                    version + ', Requested/Downloading - ' +
                    downloadConfig.version);
            } else {
                grunt.log.writeln('no local electron found. downloading ' +
                    downloadConfig.version);
            }
            grunt.task.run(['download-electron']);
        } else {
            grunt.log.writeln('Electron version ' + downloadConfig.version + ' OK');
        }
    });
};
