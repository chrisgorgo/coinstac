'use strict';
var _ = require('lodash');
/**
 * bootstrap main process.  load and execute all app-level utilites, providing an optional
 * configuration object to each utility
 * @param  {object=} opts keys => utility names, values => utility configurations
 * @return {undefined}
 */
module.exports = function(opts) {
    var path = require('path');
    opts = opts || {};
    var bootUtils = [
        'configure-uncaught-errors',
        'configure-error-serialization',
        'promisify-fs',
        'define-globals',
        'parse-cli-input',
        'build-index',
        'upsert-coinstac-user-dir',
    ];

    // require utility and execute it with optional config
    bootUtils.forEach(function(util) {
        var utilPath = path.resolve(__dirname, util + '.js');
        require(utilPath)(opts[util]);
    });

    // assert that all boot configurations provided match a valid utility name
    var bootOpts = Object.keys(opts);
    var invalidBootKeys = _.without.apply(this, [bootOpts].concat(bootUtils));
    if (invalidBootKeys.length) {
        throw new ReferenceError('invalid bootstrap configuration utility specified: ' +
            invalidBootKeys[0]);
    }
};
