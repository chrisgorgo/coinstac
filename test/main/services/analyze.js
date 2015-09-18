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
        sha: 'abc123'
    });
    var testFile2 = new File({
        filename: 'free-surfer-dummy-2.txt',
        dirname: path.resolve(__dirname, 'mocks'),
        sha: 'xyz789'
    });


    t.plan(4);

    // test valid one-shot file inputs
    oneShot({
        requestId: 1,
        predictors: ['CortexVol'],
        files: [ testFile1.serialize(), testFile2.serialize() ],
    }).then(function(data) {
        if (data.error) {
            t.fail('one-shot valid inputs produced error');
            return console.error(data.error.message);
        }
        t.equal(1, Object.keys(data.result).length, 'produces regressor set of proper length');
        t.equal(testFile1.sha, _.get(data, 'fileShas[0]'), 'fileShas returned');
    })

    // test invalid one-shot file inputs
    .then(function() {
        return oneShot({
            requestId: 2,
            predictors: ['CortexVol'],
            files: [ {filename: 'bogus', dirname: 'bogus'} ],
        }).then(function() {
            t.fail('invalid input did not error');
        }).catch(function(error) {
            t.ok(error.message, 'returns object with error prop on invalid input');
            t.equal(error.path, 'bogus/bogus', 'path returned for errors on files');
        });
    });
});
