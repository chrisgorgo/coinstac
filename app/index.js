'use strict';
require('./js/services/promise-uncaught-polyfill')(global);
var app = require('app');
var BrowserWindow = require('browser-window');
var fs = require('fs');
Promise.promisifyAll(fs);

var opts = require('nomnom')
   .option('development', {
      abbr: 'dev',
      flag: true,
      help: 'run in development mode'
   })
   .parse();

if (opts.development) {
    var spawn = require('child_process').spawn;
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

    // bind x-process listeners
    require('./main/services/analyze.js');
    require('./main/services/files.js')(mainWindow);

});
