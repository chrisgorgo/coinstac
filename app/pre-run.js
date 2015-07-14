var fs = require('fs');
var jade = require('jade');
var locals = {
    pageTitle: 'COINSTAC'
};

if (process.env.COINS_ENV === 'development') {
    locals.entryUrl = 'http://localhost:22222/assets/app.bundle.js';
} else {
    locals.entryUrl = 'build/js/app.bundle.js';
}

// Complile the index template
var fn = jade.compileFile('./app/index.jade', {
    pretty: true
});
var html = fn(locals);

fs.writeFileSync('./app/index.html', html, {encoding: 'utf8'});