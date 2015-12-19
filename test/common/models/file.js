'use strict';
var _ = require('lodash');
var path = require('path');
var File = require(path.join(process.cwd(), 'app/common/models/file.js'));
var test = require('tape');

var factory = function(opts) {
    return function() {
        return new File(opts);
    };
};

var validOps = function() {
    return {
        filename: 'testFile',
        dirname: '/test/dir',
        sha: 'testSha',
        tags: []
    };
};

test('model::file - general', function(t) {
    var f1 = factory(validOps())();
    _.assign(f1, { filename: 'f1', sha: 'f1' });
    var f2 = validOps(); // raw model form
    _.assign(f2, { filename: 'f2', sha: 'f2' });

    t.equal(f1.path, path.join(f1.dirname, f1.filename));
    t.notEqual(f1.path, f2.path, 'unique paths generated');

    t.end();
});
