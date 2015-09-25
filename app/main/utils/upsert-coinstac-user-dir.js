var fs = require('fs');
module.exports = function() {
    var stat;
    try {
        stat = fs.statSync(global.coinstacDir);
    } catch (err) {
        if (err.code === 'ENOENT') {
            return fs.mkdirSync(global.coinstacDir);
        }
        throw err;
    }
};
