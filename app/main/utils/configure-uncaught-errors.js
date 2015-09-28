'use strict';
/**
 * Setup process listeners to handle uncaught exceptions
 * @return {undefined}
 */
module.exports = function() {
    var path = require('path');
    require(path.join(process.cwd(), 'app/common/utils/promise-uncaught-polyfill.js'))({ root: global });
    process.on('uncaughtException', function(err) {
        console.log('Caught exception: ' + err);
        console.dir(err);
    });
};
