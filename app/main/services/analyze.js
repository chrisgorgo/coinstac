'use strict';
var ipc = require('ipc');
var oneShot = require('./analyses/one-shot.js');
var multiShot = require('./analyses/multi-shot.js');
var Errio = require('errio');
var _ = require('lodash');
var clientIdentifier = require('../../common/utils/client-identifier.js');

/**
 * analyze files requested from render process
 * post-analysis, emits event with results of object of form
 *     {
 *         requestId: {number},
 *         data: {
 *             result: {output, from, analysis, routine}
 *             fileShas: [array, of, shas]
 *         },
 *         error: { ... serialized error, if applicable ... }
 *     }
 */
ipc.on('analyze-files', function(event, request) {
    /**
     * send result over ipc
     * @param  {any} result the result object to send
     * @return {none}        none
     */
    var sendResult = function(err, result) {
        if (err) {
            err = Errio.stringify(err);
            console.dir(err);
        }
        console.log('emitting result: ');
        console.dir(result);
        event.sender.send('files-analyzed', {
            consortiumId: request.consortiumId,
            requestId: request.requestId,
            fileShas: _.pluck(request.files, 'sha'),
            data: result,
            error: err,
            username: clientIdentifier,
        });
    };

    console.log('analyze-files request: ');
    console.dir(request);
    var result = multiShot(request);
    result.then(function(result) {
        return sendResult(null, result);
    }).catch(function(err) {
        return sendResult(err)
    });
});

module.exports = {
    oneShot: oneShot
};
