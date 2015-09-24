'use strict';
var path = require('path');
var glob = require("glob");
var chalk = require('chalk');
var files = glob.sync(path.join(__dirname, "/*.js")).filter(function(f) {
    // filter this file!
    return !f.match(/index.js/);
});

files.forEach(function requireTest(file) {
    var fullPath = path.resolve('./', file);
    console.log(chalk.blue('Executing ' + file + '...'));
    require(fullPath);
});
