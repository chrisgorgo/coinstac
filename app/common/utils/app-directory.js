/**
 * Application directory.
 *
 * Single access point for the application's user directory's path.
 */

'use strict';

var path = require('path');
var osHomedir = require('os-homedir');
var appDirectory = path.join(osHomedir(), '.coinstac');

module.exports = appDirectory;
