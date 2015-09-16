'use strict';
var ipc = require('ipc');
var oneShot = require('./analyses/one-shot.js');

ipc.on('analyze-files', oneShot);

module.exports = {
    oneShot: oneShot
};
