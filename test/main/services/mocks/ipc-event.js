'use strict';
var _ = require('lodash');

module.exports = function getMockIpc() {
    return {
        sender: {
            send: function(cb) {
                if (!_.isFunction(cb)) {
                    throw new ReferenceError('provide a callback to the mock');
                }
                return function(evtName, result) {
                    return cb.apply(this, _.toArray(arguments));
                }
            }
        }
    };
};
