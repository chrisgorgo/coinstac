'use strict';
var _ = require('lodash');
var path = require('path');
var Analysis = require(path.join(process.cwd(), 'app/js/models/analysis.js'));
var test = require('tape');
var moment = require('moment');

var factory = function(opts) {
    return function() {
        return new Analysis(opts);
    };
};

var validOps = function() {
    return {
        _rev: 'testRev123',
        consortiumId: 'testConsortiumId123',
        fileSha: 'testSha123',
        complete: moment().format(), // forces dates in ISO 8601 long string
        data: ['testResult'],
        username: 'testUsername'
    };
};

test('model::analysis - constructor', function(t) {
    t.throws(factory(), Error, 'errors without content');
    var a1 = factory(validOps())();
    t.ok(a1, 'constructs with valid input');

    t.throws(
        factory(_.assign({}, validOps(), { fileSha: 0})), // typeof _id === string
        Error,
        'errors on incorrectly formatted content - sha'
    );
    t.end();
});

test('model::analysis - predictable _id', function(t) {
    // MD5 ("testSha123testConsortiumId123") = 2b3f1a4fcc9bb59e653a61129af49f16
    var a1 = factory(validOps())();
    var testSha = a1.fileSha + a1.consortiumId;
    var cmdLineSha = '2b3f1a4fcc9bb59e653a61129af49f16';
    t.equal(a1._id, cmdLineSha, 'md5 _id match');
    t.end();
});

test('model::analysis - serialization includes derived', function(t) {
    var a1 = factory(validOps())();
    t.deepLooseEqual(
        a1.serialize(),
        _.assign(validOps(), { _id: '2b3f1a4fcc9bb59e653a61129af49f16'}),
        'predictable serialization'
    );
    t.end();
});
