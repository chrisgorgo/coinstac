'use strict';
var _ = require('lodash');
var path = require('path');
var PD = require(path.join(process.cwd(), 'app/js/models/pouch-document.js'));
var test = require('tape');
var moment = require('moment');

var factory = function(opts) {
    return function() {
        return new PD(opts);
    };
};
var validOps = function() {
    return {
        _id: 'testId123',
        _rev: 'testRev123'
    };
};

test('model::pouch-document - constructor', function(t) {
    var pd1 = factory(validOps())();
    t.ok(pd1, 'constructs with valid input');

    t.throws(
        factory(_.assign({}, validOps(), { _id: 0})), // typeof _id === string
        Error,
        'errors on incorrectly formatted content - _id'
    );
    t.end();
});
