'use strict';
var _ = require('lodash');
var path = require('path');
var Analysis = require(path.join(process.cwd(), 'app/js/models/analysis.js'));
var test = require('tape');
var moment = require('moment');

var factory = function(opts) {
    return function() {
        debugger;
        return new Analysis(opts);
    };
};
var validOps = function() {
    return {
        _id: 'testId123',
        _rev: 'testRev123',
        consortiumId: 'testConsortiumId123',
        fileSha: 'testSha123',
        complete: moment().format(), // forces dates in ISO 8601 long string
        result: ['testResult'],
        username: 'testUsername'
    };
};

test('model::analysis - constructor', function(t) {
    t.throws(factory(), Error, 'errors without content');
    var a1 = factory(validOps())();
    t.ok(a1, 'constructs with valid input');

    t.throws(
        factory(_.assign({}, validOps(), { _id: 0})), // typeof _id === string
        Error,
        'errors on incorrectly formatted content - _id'
    );
    t.end();
});
