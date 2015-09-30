/**
 * Application directory.
 *
 * Single access point for the application's user directory's path.
 */

'use strict';

var os = require('os');
var path = require('path');

var appDirectory = path.join(os.homedir(), '.coinstac');

module.exports = appDirectory;
