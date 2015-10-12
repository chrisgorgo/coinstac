'use strict';
var _ = require('lodash');
var path = require('path');
var oneShot = require(path.join(process.cwd(), 'app/main/services/analyses/one-shot.js'));
var File = require(path.join(process.cwd(), 'app/js/models/file.js'));
var test = require('tape');

test('main process analyze::one-shot', function(t) {
    var testFile1 = new File({
        filename: 'free-surfer-dummy-1.txt',
        dirname: path.resolve(__dirname, 'mocks'),
        sha: 'abc123',
        tags: { control: false, patient: true }
    });
    var testFile2 = new File({
        filename: 'free-surfer-dummy-2.txt',
        dirname: path.resolve(__dirname, 'mocks'),
        sha: 'xyz789',
        tags: { control: true, patient: false }
    });


    t.plan(4);

    // test valid one-shot file inputs
    oneShot({
        requestId: 1,
        predictors: ['CortexVol'],
        files: [ testFile1.serialize(), testFile2.serialize() ],
    }).then(function(data) {
        t.ok(0 < data.r2 && data.r2 <= 1, 'valid r^2 generated');
        t.ok(Math.abs(data['CortexVol']), 'optimized independent var β returned for roi-predictors');
    }).then(function() {
        // test invalid one-shot file inputs
        return oneShot({
            requestId: 2,
            predictors: ['CortexVol'],
            files: [ {filename: 'bogus', dirname: 'bogus'} ],
        });
    }).then(function() {
        t.fail('invalid input did not error');
    }).catch(function(error) {
        t.ok(error.message, 'returns object with error prop on invalid input');
        t.equal(error.path, 'bogus/bogus', 'path returned for errors on files');
        t.end();
    });
});
