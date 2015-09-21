'use strict';
require('../js/services/promise-uncaught-polyfill')(global);
process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err);
    console.dir(err);
});

var fs = require('fs');
Promise.promisifyAll(fs);

var Errio = require('errio');
Errio.setDefaults({ include: ['data'] });

var chalk = require('chalk');

// configure, parse, and exec cli options
var opts = require('nomnom')
   .option('development', {
      abbr: 'dev',
      flag: true,
      help: 'run in development mode (COINS_ENV === "development")'
   })
   .option('webpack', {
      abbr: 'w',
      flag: true,
      help: 'boot webpack dev server as child process'
   })
   .parse();

if (opts.development) {
    process.env.COINS_ENV = 'development';
    console.log(chalk.blue('COINS_ENV set to "development"'));
}

if (opts.webpack) {
    var spawn = require('child_process').spawn;
    console.log(chalk.blue('booting webpack-dev-server'));
    var wpds = spawn('npm', ['run', 'webpack']);
    wpds.stdout.on('data', function(data) {
        console.log(chalk.cyan('coinstac-webpack-server: ' + data));
    });

    wpds.stderr.on('data', function(data) {
        console.error(chalk.red('coinstac-webpack-server [error]: ' + data));
    });

    wpds.on('close', function(code) {
        if (code !== 0) {
            console.log(chalk.bgRed('coinstac-webpack-server [fatal] ' + code));
        }
    });
}
