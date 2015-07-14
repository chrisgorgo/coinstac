'use strict';
var domready = require('domready');
domready(function() {
    window.log = function() {console.dir(arguments);};
    var hostname = '192.168.1.124';
    var port = '5984';
    var dbName = 'con1';
    var serverEl = document.querySelector('[data-hook=target-server]');
    serverEl.textContent = hostname + ':' + port;

    var PouchAdapter = require('./PouchAdapter.js');
    window.db = new PouchAdapter({
        name: dbName,
        conn: {
            protocol: 'http',
            hostname: hostname,
            port: port,
            pathname: dbName
        },
        pouchOptions: {},
        replicate: [
            {
                dir: 'in'
            },
            {
                dir: 'out'
            }
        ]
    });

    window.db.db.changes({
        since: 'now',
        live: true,
        include_docs: true // jshint ignore:line
    }).on('change', window.log);

});
