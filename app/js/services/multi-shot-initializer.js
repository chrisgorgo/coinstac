'use strict';

var analyze = require('./analyze');
var app = require('ampersand-app');
var assign = require('lodash/object/assign');
var consortia = require('./consortia');
var consortiumAnalysesResults =
    require('./consortium-analyses-results');
var clientIdentifier = require('../../common/utils/client-identifier');
var dbs = require('./db-registry');
var sha1 = require('sha-1');
var Promise = require('bluebird');

var projects = dbs.get('projects');

// Cache listeners and change handlers
var aggregateChangeListeners = [];
var aggregateChangeHandlers = [];

// Get user's consortia
function getUserConsortia() {
    return consortia.all()
        .then(function(consortia) {
            return consortia.filter(function(consortium) {
                return consortium.users.some(function(user) {
                    return user.username === clientIdentifier;
                });
            });
        });
}

// Get change listeners for the consortia the user's joined
function getAnalysesResultsListeners() {
    return getUserConsortia().then(function(consortia) {
        return consortia.map(function(consortium) {
            return consortiumAnalysesResults.getListener(
                consortium._id
            );
        });
    });
}

// Respond to analyses aggregate result changes
function onAggregateChange(newAggregate, files) {
    var history = newAggregate.history;

    /** @todo  Don't hard-code these attributes */
    var predictors = ['Left-Hippocampus'];
    var type = 'multi';

    if (
        // See if user is a part of this aggregate
        newAggregate.contributors.indexOf(clientIdentifier) !== -1 &&

        // See if user hasn't run analysis the latest
        !history[history.length - 1][clientIdentifier]
    ) {
        analyze.analyze({
            files: files,
            mVals: newAggregate.data.mVals,
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
}

// Respond to user's analysis complete
function onAnalysisComplete(result) {
    var error = result.error;
    var fileShas = result.fileShas;
    var id;

    if (error) {
        return app.notifications.push({
            level: 'error',
            message: 'Failed to analyze files: ' + error.message,
        });
    }

    /** @todo  Move result `_id` generation to a common utility */
    id = sha1(fileShas.sort().join(''));

    /** @todo  There has to be a better way to do this */
    getUserConsortia()
        .then(function(consortia) {
            return Promise.all(consortia.map(function(consortium) {
                var name = 'consortia-' + consortium._id.replace(/_/g, '-');

                // Find the name of the db with a document with `id`
                return new Promise(function(resolve, reject) {
                    dbs.get(name).find({
                        fields: ['_id'],
                        limit: 1,
                        selector: { _id: id },
                    })
                        .then(function(result) {
                            if (result && result.length) {
                                resolve(name);
                            } else {
                                resolve();
                            }
                        })
                        .catch(reject);
                });
            }));
        })
        .then(function(names) {
            var name = names.sort().slice(0, 1).pop();

            if (!name) {
                throw new Error('Could not find db: ' + name);
            }

            return dbs.get(name).save(assign({}, result, { _id: id }));
        })
        .then(function(result) {
            app.notifications.push({
                level: 'success',
                message: 'Analysis request' + result.requestId + 'complete!',
            });
        })
        .catch(function(error) {
            var message = (error.status === 409) ?
                'Analysis on files already submitted' :
                'Unable to save completed analysis: ' + error.message;

            app.notifications.push({
                level: 'error',
                message: message,
            });
        });
}

// Wire everthing up
function init() {
    analyze.addChangeListener(onAnalysisComplete);

    return Promise.all([projects.all(), getAnalysesResultsListeners()])
        .then(function(results) {
            var projects = results[0];
            var listeners = results[1];

            // Match analyses results listener with projects' files
            return listeners.map(function(listener) {
                var project = projects.find(function(project) {
                    return (
                        project.defaultConsortiumId === listener.consortiumId
                    );
                });
                var handler;
                var onChange;

                if (project) {
                    onChange = function(change) {
                        onAggregateChange(change.doc, project.files);
                    };
                    handler = listener.on('change', onChange);

                    aggregateChangeHandlers.push(onChange);
                    aggregateChangeListeners.push(handler);

                    return handler;
                }
            });
        }, function(error) {
            console.error(error);
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
    destroy: destroy,
    init: init,
};
