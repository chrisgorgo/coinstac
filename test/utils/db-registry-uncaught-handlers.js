'use strict';
var chalk = require('chalk');

/**
 * handle bogus url detection.  in our test cases, this is OK,
 * so simply do nothing
 * @param  {Error} err
 * @return {undefined}
 */
var bogusUrlHandler = function(err) {
    // pass
};
bogusUrlHandler.match = function(err) {
    if (!err) {
        return;
    }
    var msg = err.text || err.message;
    return msg.match('bogus-url');
}

module.exports = [ bogusUrlHandler ];
