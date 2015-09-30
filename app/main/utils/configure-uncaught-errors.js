'use strict';
/**
 * Setup process listeners to handle uncaught exceptions
 * @return {undefined}
 */
module.exports = function(opts) {
    var path = require('path');
    var _ = require('lodash');
    var uncaughtOpts = _.defaults({}, opts, { root: global });
    require(path.join(process.cwd(), 'app/common/utils/promise-uncaught-polyfill.js'))(uncaughtOpts);
    process.on('uncaughtException', function(err) {
        console.log('Caught exception: ' + err);
        console.dir(err);
    });
};
