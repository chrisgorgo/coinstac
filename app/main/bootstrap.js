'use strict';
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
        'define-globals',
        'parse-cli-input',
        'build-index',
        'configure-promise-polyfill',
        'configure-error-serialization',
        'promisify-fs',
        'upsert-coinstac-user-dir',
    ];

    // require utility and execute it with optional config
    bootUtils.forEach(function(util) {
        var utilPath = path.resolve(__dirname, './utils', util + '.js');
        require(utilPath)(opts[util]);
    });
};
