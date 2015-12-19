'use strict';
var _ = require('lodash');
var path = require('path');
var File = require(path.join(process.cwd(), 'app/common/models/file.js'));
var FileCollection = require(path.join(process.cwd(), 'app/common/models/file-collection.js'));
var test = require('tape');
var moment = require('moment');

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

test('collection::file-collection - general', function(t) {
    var f1 = factory(validOps())();
    _.assign(f1, { filename: 'f1', sha: 'f1' });
    var f2 = validOps(); // raw model form
    _.assign(f2, { filename: 'f2', sha: 'f2' });
    var modelSet = [f1, f2];
    var collection = new FileCollection(modelSet);
    t.ok(collection.models[0] instanceof File, 'File file in collection remains File');
    t.ok(collection.models[1] instanceof File, 'raw file in collection converts to File');
    t.equal(collection.models[0], collection.get(f1.sha, 'sha'), '`sha` index works');
    t.equal(collection.models[1], collection.get('/test/dir/f2'), '`path` index works');
    t.end();
});
