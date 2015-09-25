'use strict';
var _ = require('lodash');
var path = require('path');
var test = require('tape');
var dbs = require(path.join(process.cwd(), 'app/js/services/db-registry.js'));

var app = require('ampersand-app');
test('render process, db-registry', function(t) {
    app.reset();
    app.coinstacDir = global.coinstacDir;
    var pdb = dbs.get('projects');
    t.ok(pdb, '`get` returns a Pouchy');
    t.end();
});
