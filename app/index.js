'use strict';
var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');
var ipc = require('ipc');
var dialog = require('dialog');
var fs = require('fs');
var RSVP = require('rsvp');
var spawn = require('child_process').spawn;
var opts = require("nomnom")
   .option('development', {
      abbr: 'dev',
      flag: true,
      help: 'run in development mode'
   })
   .parse();

if (opts.development) {
    process.env.COINS_ENV = 'development';
    console.log("> devmode - booting webpack-dev-server");
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

    // Create the browser window.
    mainWindow = new BrowserWindow({width: 800, height: 600});

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

    // Listen for `add-file` event and respond with files
    ipc.on('add-file', function (event) {
        dialog.showOpenDialog(
            mainWindow,
            { properties: ['openFile'] },
            function (files) {
                files = files || [];

                var promises = files.map(function (file) {
                    return new RSVP.Promise(function (resolve, reject) {
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

                RSVP.all(promises).then(function (files) {
                    event.sender.send('files-added', files);
                }).catch(function (err) {
                    console.error(err);
                });
            }
        );
    });
});
