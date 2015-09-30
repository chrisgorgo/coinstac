'use strict';
var _ = require('lodash');
var path = require('path');
var test = require('tape');
var dbs = require(path.join(process.cwd(), 'app/js/services/db-registry.js'));
var Pouchy = require('pouchy');

var app = require('ampersand-app');
app.coinstacDir = global.coinstacDir;

test('render process, db-registry, general `.get()` ops', function(t) {
    var pdb = dbs.get('projects');
    t.ok(pdb instanceof Pouchy, '`get` returns a Pouchy instance');
    t.end();
});

test('render process, db-registry, consortium ops', function(t) {
    var tdbUrl = 'http://www.bogus-url/consortium-__test-url__';
    var tdb;

    t.throws(function() {
        tdb = dbs.get('consortium-__test__');
        t.fail('consortium did not error when URL was not provided');
    }, Error, 'consortium must provide url to instatiate db');

    tdb = dbs.get(tdbUrl);
    t.equal(tdb.url, tdbUrl, 'consortium db with url generates successfully');

    t.end();

});
