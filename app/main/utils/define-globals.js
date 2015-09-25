'use strict';
module.exports = function() {
    var os = require('os');
    var path = require('path');
    global.coinstacDir = path.join(os.homedir(), '.coinstac');
};
