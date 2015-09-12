var chalk = require('chalk');
var notes = [
    '@dev - yo brotha!  read up!',
    '(no open issues)',
    '', '', ''
];

notes.forEach(function(n) {
    console.log(chalk.red(n));
});