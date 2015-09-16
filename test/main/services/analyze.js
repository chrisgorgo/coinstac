'use strict';
var _ = require('lodash');
var path = require('path');
var oneShot = require(path.join(process.cwd(), 'app/main/services/analyses/one-shot.js'));
var getMockEvent = require('./mocks/ipc-event.js');
var File = require(path.join(process.cwd(), 'app/js/models/file.js'));
var test = require('tape');

test('main process analyze::one-shot', function(t) {
    var mockEvent = getMockEvent();
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

    // prep fake IPC with callabck to make assertions
    mockEvent.sender.send = mockEvent.sender.send(function(evtName, result) {
        if (result.result.error) {
            return t.fail(result.result.error.message);
        }
        t.equal(evtName, 'files-analyzed', 'event name = files-analyzed');
        t.equal(testFile1.sha, _.get(result, 'result.fileShas[0]'), 'fileShas returned');
    });

    t.plan(2);
    oneShot(mockEvent, {
        files: [ testFile1.serialize(), testFile2.serialize() ],
        requestId: 1
    })
});
