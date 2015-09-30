var fs = require('fs');

var appDirectory = require('../../common/utils/app-directory');

module.exports = function() {
    var stat;
    try {
        stat = fs.statSync(appDirectory);
    } catch (err) {
        if (err.code === 'ENOENT') {
            return fs.mkdirSync(appDirectory);
        }
        throw err;
    }
};
