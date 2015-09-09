var chalk = require('chalk');
var notes = [
    '@dev - yo brotha!  read up!',
    '@TODO replace ampersand-collection with default version after merge and npm publish of https://github.com/AmpersandJS/ampersand-collection/pull/67',
    '', '', ''
];

notes.forEach(function(n) {
    console.log(chalk.red(n));
});