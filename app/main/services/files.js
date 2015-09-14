'use strict';
var ipc = require('ipc');
var dialog = require('dialog');
var fs = require('fs');
module.exports = function(mainWindow) {

    // Listen for `add-file` event and respond with files
    ipc.on('select-files', function (event, arg) {
        dialog.showOpenDialog(
            mainWindow,
            { properties: [ 'openFile', 'multiSelections' ] },
            function (files) {
                console.dir(arguments);
                files = files || [];
                var promises = files.map(function (file) {
                    return new Promise(function (resolve, reject) {
                        fs.stat(file, function (err, stat) {
                            console.log('Reading file: ' + file, stat);
                            if (err) {
                                reject(err);
                            }
                            resolve({
                                filename: file,
                                size: stat.size,
                                modified: stat.mtime.getTime()
                            });
                        });
                    });
                });

                Promise.all(promises).then(function (files) {
                    event.sender.send('files-selected', {
                        requestId: arg.requestId,
                        files: files
                    });
                }).catch(function (err) {
                    console.error(err);
                });
            }
        );
    });
};
