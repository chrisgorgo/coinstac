'use strict';
var path = require('path');
var glob = require("glob");
var chalk = require('chalk');

require('../app/main/bootstrap.js');

console.log(chalk.blue('Queuing tests...'));
glob("./test/**/index.js", null, function (err, files) {
    if (err) {

    }
    // filter this file!
    var testIndexes = files.filter(function(f) {
        return !f.match(/test\/index.js/);
    });

    testIndexes.forEach(function requireTest(f) {
        var fullPath = path.resolve('./', f);
        require(fullPath);
    });
});
