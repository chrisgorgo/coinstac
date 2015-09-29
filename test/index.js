'use strict';
var path = require('path');
var glob = require("glob");
var chalk = require('chalk');

require('../app/main/bootstrap.js')();

console.log(chalk.blue('Queuing tests...'));
var testIndexes = glob.sync("./test/**/index.js").filter(function(f) {
    // filter this file!
    return !f.match(/test\/index.js/);
});

testIndexes.forEach(function requireTest(f) {
    var fullPath = path.resolve('./', f);
    console.log(chalk.blue('Executing ' + f + '...'));
    require(fullPath);
});
