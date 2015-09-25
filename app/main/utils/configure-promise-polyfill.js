'use strict';
module.exports = function() {
    require('../../js/services/promise-uncaught-polyfill')(global);
    process.on('uncaughtException', function(err) {
        console.log('Caught exception: ' + err);
        console.dir(err);
    });
};
