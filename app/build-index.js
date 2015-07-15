var fs = require('fs');
var jade = require('jade');
var config = require('config');
var _ = require('lodash');
var url = require('url');
var locals;

config.api.url = url.format({
    protocol: config.api.protocol,
    hostname: config.api.hostname,
    port: config.api.port
});

locals = {
    pageTitle: 'COINSTAC',
    config: _.assign(config)
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
