'use strict';
require('./main/bootstrap.js')();
var app = require('app');
var BrowserWindow = require('browser-window');

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
