'use strict';
module.exports = function() {
    var chalk = require('chalk');
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
        var wpds = spawn('node', ['webpack-dev-server.js', '--development']);
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
};
