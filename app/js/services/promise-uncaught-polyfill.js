'use strict';
module.exports = function(root) {
    var app = require('ampersand-app'); // @note - only available in rendering process
    root.Promise = require('bluebird');
    root.Promise.longStackTraces();

    /**
     * @package promise-uncaught-polyfill
     * This package is used in both the rendering AND main process to detect
     * uncaught promises
     * @param  {error}
     * @return {undefined}
     */
    Promise.onPossiblyUnhandledRejection(function(error) {
        error = error || {};
        var msg = error.message || 'unhandled error occurred :/';
        if (app.notifications) {
            app.notifications.push({
                message: msg,
                level: 'error'
            });
        }
        console.error(error.message, 'trace:');
        console.dir(error.stack);
        throw error;
    });
};
