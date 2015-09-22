'use strict';
var _ = require('lodash');
var path = require('path');
var File = require(path.join(process.cwd(), 'app/js/models/file.js'));
var test = require('tape');

test('model::project', function(t) {
    var f1 = new File({
        filename: 'free-surfer-dummy-1.txt',
        dirname: path.resolve(__dirname, 'mocks'),
        sha: 'abc123'
    });
    var f1s = f1.serialize();

    t.ok(f1s.tags, 'has tags, default');
    t.equal(f1s.tags.control, false, 'has control === false, default');
    t.end();
});
