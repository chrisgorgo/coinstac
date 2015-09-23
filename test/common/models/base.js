'use strict';
var _ = require('lodash');
var path = require('path');
var Base = require(path.join(process.cwd(), 'app/js/models/base.js'));
var test = require('tape');

var BaseModel = Base.extend({
    props: {
        key: {
            required: true,
            type: 'string'
        }
    }
});

var factory = function(opts) {
    return function() {
        return new BaseModel(opts);
    };
};
var validOps = function() {
    return {
        key: 'testKey'
    };
};

test('model::base - constructor', function(t) {
    var bm = factory(validOps())();
    t.ok(bm, 'constructs with valid input');

    t.throws(factory(), Error, 'errors without content');

    t.throws(
        factory(_.assign({}, validOps(), { key: 0})), // typeof _id === string
        Error,
        'errors on incorrectly formatted content - key'
    );
    t.end();
});

