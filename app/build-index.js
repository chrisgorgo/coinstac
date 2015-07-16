var fs = require('fs');
var jade = require('jade');
var _ = require('lodash');
var locals;

locals = {
    pageTitle: 'COINSTAC'
};

if (process.env.COINS_ENV === 'development') {
    locals.entryUrl = 'http://localhost:3000/bundle.js';
} else {
    locals.entryUrl = 'bundle.js';
}

// Complile the index template
var fn = jade.compileFile('./app/index.jade', {
    pretty: true
});
var html = fn(locals);

fs.writeFileSync('./app/index.html', html, {encoding: 'utf8'});
