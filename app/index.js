'use strict';
require('./js/services/promise-uncaught-polyfill')(global);
var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');
var ipc = require('ipc');
var dialog = require('dialog');
var fs = require('fs');
var _ = require('lodash');
var spawn = require('child_process').spawn;
var FreeSurfer = require('freesurfer-parser');
var osr = require('coinstac-distributed-algorithm-set').oneShotRegression;
var path = require('path');
Promise.promisifyAll(fs);

var opts = require('nomnom')
   .option('development', {
      abbr: 'dev',
      flag: true,
      help: 'run in development mode'
   })
   .parse();

if (opts.development) {
    process.env.COINS_ENV = 'development';
    console.log('> devmode - booting webpack-dev-server');
    var wpds = spawn('npm', ['run', 'webpack']);
    wpds.stdout.on('data', function(data) {
        console.log('coinstac-webpack-server: ' + data);
    });

    wpds.stderr.on('data', function(data) {
        console.error('coinstac-webpack-server [error]: ' + data);
    });

    wpds.on('close', function(code) {
        if (code !== 0) {
            console.log('coinstac-webpack-server [fatal] ' + code);
        }
    });

    // @TODO why can't we just require in the server. it errors on node-sass?
    // console.dir(process.cwd());
    // require('../webpack-server.js');

}

require('./build-index.js'); // generate index.html

// Report crashes to our server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {
    var atomScreen = require('screen');
    var size = atomScreen.getPrimaryDisplay().workAreaSize;

    /**
     * Create the browser window, set to fill user's screen.
     *
     * @{@link  http://electron.atom.io/docs/v0.31.0/api/screen/}
     */
    mainWindow = new BrowserWindow({
        width: size.width,
        height: size.height
    });

    // and load the index.html of the app.
    mainWindow.loadUrl('file://' + __dirname + '/index.html');

    // Open the devtools.
    mainWindow.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });

    ipc.on('analyze-files', function(event, arg) {
        var result;
        var roiPromises;
        var analysisMeta = {
            predictors: ['CortexVol'],
            getDependentVars: function(file) {
                //return true if file is for a control
                return !!file.tags.control;
            }
        };

        /**
         * get input to oneShotRegression analysis from roi values and files
         * @param  {object} rois object of ROIs and volumes parsed from file
         * @param  {object} fileMeta metadata about the file
         * @return {object}      object with predictors and dependentVar props
         */
        var getAnalysisInputs = function(rois, file) {
            var predictorKeys = analysisMeta.predictors;
            var predictors = _.map(predictorKeys, function(res, roiName) {
                if (_.undefined(res[roiName])) {
                    throw new Error(['Could not locate',
                        roiName,
                        'in data for file',
                        path.join(file.dirname, file.filename)
                    ].join(' '));
                }

                return rois[roiName];
            });

            return {
                predictors: predictors,
                dependentVars: analysisMeta.getDependentVars(file)
            };
        };

        /**
         * send result over ipc
         * @param  {any} result the result object to send
         * @return {none}        none
         */
        var sendResult = function(result) {
            event.sender.send('files-analyzed', {
                requestId: arg.requestId,
                result: result
            });
        };

        if (!arg.filePaths) {
            result.error = new Error('No files received via IPC');
            console.log(result.error.message);
            sendResult(result);
            return;
        }

        roiPromises = arg.files.map(function readAndParseFiles(file) {
            var filePath = path.join(file.dirname, file.filename);
            return fs.readFileAsync(filePath)
                .then(function parseFile(data) {
                    var str = data.toString();
                    return new FreeSurfer({string: string});
                })
                .then(_.partialRight(getAnalysisInputs, file));
        });

        Promise.all(roiPromises)
            .then(function computeRegression(analysisInputs) {
                var predictors = _.pluck(analysisInputs, 'predictors');
                var response = _.pluck(analysisInputs, 'dependentVars');
                var regressor = _.range(1, predictors[0].length, 0);
                var osrResult = osr.objective(regressor, predictors, response);
                result = {
                    fileShas: _.pluck(files, 'sha'),
                    result: osrResult
                };
            })
            .catch(function(err) {
                result.error = err;
                console.log('Error reading and parsing file: ', error.message);
                sendResult(result);
            });



    });

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
});
