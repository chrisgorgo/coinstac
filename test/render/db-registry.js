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
    var tdb;

    t.throws(function() {
        tdb = dbs.get('consortium-__test__');
        t.fail('consortium did not error when URL was not provided');
    }, Error, 'consortium must provide url to instatiate db');

    // this will generate extraneous, erroring output.  thats OK!
    // we are only testing that a db instance was receieved, not
    // if the instance has a valid connection
    tdb = dbs.get('http://bogus-url/consortium-__test__');
    t.ok(tdb, 'consortium db with url generates successfully');

    t.end();

});
