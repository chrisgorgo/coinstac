'use strict';
module.exports = function() {
    var fs = require('fs');
    var path = require('path');
    var jade = require('jade');
    var _ = require('lodash');
    var locals;

    locals = {
        pageTitle: 'COINSTAC',
        coinsEnv: process.env.COINS_ENV,
    };

    if (process.env.COINS_ENV === 'development') {
        locals.entryUrl = 'http://localhost:3000/bundle.js';
    } else {
        locals.entryUrl = 'build/bundle.js';
    }

    // Complile the index template
    var fn = jade.compileFile(path.join(process.cwd(), 'app/render/index.jade'), {
        pretty: true
    });
    var html = fn(locals);

    fs.writeFileSync(
        path.join(process.cwd(), 'app/render/index.html'),
        html,
        {encoding: 'utf8'}
    );
};
