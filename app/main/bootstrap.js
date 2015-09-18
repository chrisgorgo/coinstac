'use strict';
require('../js/services/promise-uncaught-polyfill')(global);
process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err);
    console.dir(err);
});
var fs = require('fs');
var Errio = require('errio');
Errio.setDefaults({ include: ['data'] });
Promise.promisifyAll(fs);
