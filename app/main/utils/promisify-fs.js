'use strict';
module.exports = function() {
    var fs = require('fs');
    Promise.promisifyAll(fs);
};
