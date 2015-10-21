'use strict';

var analyze = require('./analyze');
var app = require('ampersand-app');
var assign = require('lodash/object/assign');
var auth = require('./auth');
var consortia = require('./consortia');
var consortiumAnalysesResults =
    require('./consortium-analyses-results');
var dbs = require('./db-registry');
var getConsortiumDbName = require('./consortium').getConsortiumDbName;
var Lock = require('lock');
var Promise = require('bluebird');
var getAnalysisId = require('../utils/get-analysis-id');

// Cache listeners and change handlers
var aggregateChangeListeners = [];
var aggregateChangeHandlers = [];

var lock = Lock();

// Cache lock release functions
var RELEASOR = {};

/**
 * Get a project's files from an aggregate analysis's file shas.
 *
 * @param  {array}   aggregateFileShas Collection of file shas from an aggregate
 *                                     document
 * @return {Promise}
 */
function getProjectFilesFromAggregateFileShas(aggregateFileShas) {
    return dbs.get('projects').all()
        .then(function(projects) {
            // Find the user's corresponding project
            return projects.find(function(project) {
                return project.files
                    // Pluck file objects' shas
                    .map(function(file) {
                        return file.sha;
                    })
                    // Ensure all the project's shas are in `aggregateFileShas`
                    .every(function(fileSha) {
                        return aggregateFileShas.indexOf(fileSha) !== -1;
                    });
            });
        })
        .then(function(project) {
            if (!project) {
                throw new Error('Couldn\'t find user\'s corresponding project');
            }
            return project.files;
        });
}

/**
 * Get a user's analysis history.
 *
 * @param  {string}  consortiumId
 * @return {Promise}              Resolves to an analysis history array
 */
function getAnalysisHistoryFromConsortiumId(consortiumId) {
    var username = auth.getUser().username;

    return dbs.get(getConsortiumDbName(consortiumId))
        .all()
        .then(function(docs) {
            return docs.find(function(doc) {
                return !doc.aggregate && doc.username === username;
            });
        })
        .then(function(analysis) {
            if (!analysis) {
                throw new Error('Couldn’t find analysis history');
            }

            return analysis.history;
        });
}

/**
 * Run an analysis on the client.
 *
 * @param  {object}    options
 * @param  {string}    options.aggregateId
 * @param  {array}     options.files
 * @param  {object}    options.mVals
 * @return {undefined}
 */
function runAnalysis(options) {
    var aggregateId = options.aggregateId;
    var consortiumId = options.consortiumId;
    var files = options.files;

    /** @todo  Don't hard-code these attributes */
    var mVals = options.mVals || { 'Left-Hippocampus': 0 };
    var predictors = ['Left-Hippocampus'];
    var type = 'multi';

    if (!Array.isArray(files) || !files.length) {
        return app.notifications.push({
            level: 'error',
            message: 'Analysis requires files',
        });
    }
    if (!consortiumId) {
        throw new Error('Running analysis requires a consortium ID');
    }

    analyze.analyze({
        aggregateId: aggregateId,
        consortiumId: consortiumId,
        files: files,
        mVals: mVals,
        predictors: predictors,
        requestId: ++app.analysisRequestId,
        type: type,
    });
    app.notifications.push({
        level: 'info',
        message:
            'Analysis request ' + app.analysisRequestId + ' dispatched!',
    });
}

/**
 * Respond to aggregate analysis changes.
 *
 * @param  {object}    newAggregate New aggregate document
 * @param  {string}    consortiumId
 * @return {undefined}
 */
function onAggregateChange(newAggregate, consortiumId) {
    var aggregateId = newAggregate._id;

    console.log('Waiting for lock', aggregateId);
    lock(aggregateId, function(release) {
        console.log('Acquiring lock', aggregateId);

        var aggregateFileShas = newAggregate.files;
        var aggregateHistory = newAggregate.history;
        var username = auth.getUser().username;

        function releaseLock() {
            console.log('Releasing lock.', aggregateId);
            return release()();
        }

        if (
            // Ensure the aggregate has files
            aggregateFileShas.length !== 0 &&

            // Stop running analysis at max count
            aggregateHistory.length < newAggregate.maxIterations &&

            // See if user has contributed to the current iteration
            newAggregate.contributors.indexOf(username) === -1
        ) {
            Promise.all([
                getProjectFilesFromAggregateFileShas(aggregateFileShas),
                getAnalysisHistoryFromConsortiumId(consortiumId),
            ]).then(function(responses) {
                var files = responses[0];
                var analysisHistory = responses[1];

                if (
                    analysisHistory.length <= aggregateHistory.length &&
                    files
                ) {
                    if (RELEASOR[aggregateId]) {
                        throw new Error(
                            'Lock on ' + aggregateId + ' already exists!'
                        );
                    }

                    RELEASOR[aggregateId] = release();

                    runAnalysis({
                        aggregateId: aggregateId,
                        consortiumId: consortiumId,
                        files: files,
                        mVals: newAggregate.data.mVals,
                    });
                } else {
                    releaseLock();
                }
            })
            .catch(function(error) {
                releaseLock();
                console.error(error);
            });
        } else {
            releaseLock();
        }
    });
}

/**
 * Respond to user's analysis completion
 *
 * @param  {object}    result
 * @return {undefined}
 */
function onAnalysisComplete(result) {
    var aggregateId = result.aggregateId;
    var consortiumId = result.consortiumId;
    var error = result.error;
    var db;
    var id;

    if (error) {
        return app.notifications.push({
            level: 'error',
            message: 'Failed to analyze files: ' + error.message,
        });
    }

    db = dbs.get(getConsortiumDbName(consortiumId));
    id = getAnalysisId(result.fileShas);

    db.get(id)
        .then(function(doc) {
            return db.save(assign({}, doc, result, {
                history: doc.history.concat(result.data),
            }));
        }, function() {
            // Doc doesn't exist, save new analysis
            return db.save(Object.assign({}, result, {
                _id: id,
                history: [].concat(result.data),
            }));
        })
        .then(function(response) {
            app.notifications.push({
                level: 'success',
                message: 'Analysis request ' + result.requestId + ' complete!',
            });
            return response;
        })
        .catch(function(error) {
            var message = (error.status === 409) ?
                'Analysis on files already submitted' :
                'Unable to save completed analysis: ' + error.message;

            app.notifications.push({
                level: 'error',
                message: message,
            });

            console.error(error);
        })
        .then(function() {
            // Release the lock
            var release = RELEASOR[aggregateId];

            if (release instanceof Function) {
                delete RELEASOR[aggregateId];
                console.log('Releasing lock', aggregateId);
                release();
            }
        });
}

/**
 * Wire up an aggregate handler.
 *
 * @see ConsortiumAnalysesResults
 *
 * @todo  Make sure a user has projects in `consortiumId`'s aggregate before
 *        wiring up the handler. If he/she doesn't have projects then this
 *        causes unnecessary processing on the client.
 *
 * @param  {string} consortiumId
 * @return {object}              Instance of `ConsortiumAnalysesResults`
 */
function addConsortiumAggregateListener(consortiumId) {
    var changeHandler;
    var changeListener;
    var consortiumListener;

    // Exit early if a listener is already set up
    for (var i = 0, il = aggregateChangeHandlers.length; i < il; i++) {
        if (aggregateChangeHandlers[i].consortiumId === consortiumId) {
            return;
        }
    }

    // Only pass aggregates to `onAggregateChange`
    changeHandler = function(change) {
        if (change.doc.aggregate) {
            onAggregateChange(change.doc, consortiumId);
        }
    };
    consortiumListener = consortiumAnalysesResults.getListener(consortiumId);

    changeListener = consortiumListener.on('change', changeHandler);

    aggregateChangeHandlers.push(changeHandler);
    aggregateChangeListeners.push(changeListener);

    return changeListener;
}

// Wire everthing up
function init() {
    analyze.addChangeListener(onAnalysisComplete);

    return consortia.getUserConsortia()
        .then(function(userConsortia) {
            return Promise.all(userConsortia.map(function(consortium) {
                return dbs.get(getConsortiumDbName(consortium._id))
                    .all()
                    .then(function(docs) {
                        var result = {
                            consortiumId: consortium._id,
                        };

                        /**
                         * @todo  This assumes one aggregate per consortium.
                         *        Change check to make it more flexible.
                         */
                        return docs.reduce(function(result, doc) {
                            if (!!doc.aggregate) {
                                result.aggregate = doc;
                            }

                            return result;
                        }, result);
                    });
            }));
        })
        .then(function(results) {
            return results.map(function(result) {
                /**
                 * Run the aggregate change listener when the client first
                 * loads. This ensures the client runs analysis and submits it
                 * if needed.
                 *
                 * @todo  The location of this call makes it confusing. Find a
                 *        better way.
                 */
                if (result.aggregate) {
                    onAggregateChange(result.aggregate, result.consortiumId);
                }

                return addConsortiumAggregateListener(result.consortiumId);
            });
        });
}

// Remove all listeners
function destroy() {
    analyze.removeChangeListener(onAnalysisComplete);

    /** @todo  Make sure listeners aren't hanging around after this */
    for (var i = 0, il = aggregateChangeListeners.length; i < il; i++) {
        aggregateChangeListeners[i].removeListener(
            'change',
            aggregateChangeHandlers[i]
        );
    }
}

module.exports = {
    addConsortiumAggregateListener: addConsortiumAggregateListener,
    destroy: destroy,
    init: init,
    runAnalysis: runAnalysis,
};
