import Promise from 'bluebird';
import uuid from 'uuid';

import consortium, { validateAnalysis } from '../services/consortium';

/**
 * Consortium retrieval.
 */

export const CONSORTIUM_RECEIVE = 'CONSORTIUM_RECEIVE';
export const CONSORTIUM_REQUEST = 'CONSORTIUM_REQUEST';
export const CONSORTIUM_ERROR = 'CONSORTIUM_ERROR';

export function fetchConsortium(id) {
    return dispatch => {
        dispatch(requestConsortium(id));
        consortium.get(id)
            .then(consortium => dispatch(receiveConsortium(consortium)))
            .catch(error => dispatch(consortiumError(error)));
    };
}

function requestConsortium(id) {
    return {
        id,
        type: CONSORTIUM_REQUEST,
    };
}

function receiveConsortium(consortium) {
    return {
        consortium,
        type: CONSORTIUM_RECEIVE,
    };
}

export function consortiumError(error) {
    return {
        error,
        type: CONSORTIUM_ERROR,
    };
}

/**
 * Consortium user actions.
 */

export const CONSORTIUM_ADD_USER = 'CONSORTIUM_ADD_USER';
export const CONSORTIUM_REMOVE_USER = 'CONSORTIUM_REMOVE_USER';

export function addUser(consortiumId, username) {
    return {
        consortiumId,
        type: CONSORTIUM_ADD_USER,
        username,
    };
}

export function removeUser(consortiumId, username) {
    return {
        consortiumId,
        type: CONSORTIUM_REMOVE_USER,
        username,
    };
}

/**
 * Consortium meta actions/action creators.
 */

export const CONSORTIUM_EDIT_LABEL = 'CONSORTIUM_EDIT_LABEL';
export const CONSORTIUM_EDIT_DESCRIPTION = 'CONSORTIUM_EDIT_DESCRIPTION';

export function editLabel(consortiumId, label) {
    return {
        consortiumId,
        label,
        type: CONSORTIUM_EDIT_LABEL,
    };
}

export function editDescription(consortiumId, description) {
    return {
        consortiumId,
        description,
        type: CONSORTIUM_EDIT_DESCRIPTION,
    };
}

/**
 * Consortium tag actions/action creators.
 */

export const CONSORTIUM_ADD_TAG = 'CONSORTIUM_ADD_TAG';
export const CONSORTIUM_EDIT_TAG = 'CONSORTIUM_EDIT_TAG';
export const CONSORTIUM_REMOVE_TAG = 'CONSORTIUM_REMOVE_TAG';

export function addTag(consortiumId, tag) {
    return {
        consortiumId,
        tag,
        type: CONSORTIUM_ADD_TAG,
    };
}

export function editTag(consortiumId, tagId, tag) {
    return {
        consortiumId,
        id: tagId,
        tag,
        type: CONSORTIUM_EDIT_TAG,
    };
}

export function removeTag(consortiumId, tagId) {
    return {
        consortiumId,
        id: tagId,
        type: CONSORTIUM_REMOVE_TAG,
    };
}

/**
 * Analyses consortium actions/action creators.
 */

export const CONSORTIUM_ADD_ANALYSIS = 'CONSORTIUM_ADD_ANALYSIS';
export const CONSORTIUM_EDIT_ANALYSIS = 'CONSORTIUM_EDIT_ANALYSIS';
export const CONSORTIUM_REMOVE_ANALYSIS = 'CONSORTIUM_REMOVE_ANALYSIS';

export function addAnalysis(consortiumId, analysis) {
    return new Promise(function(resolve, reject) {
        validateAnalysis(consortiumId, analysis)
            .then(() => {
                resolve({
                    analysis: Object.assign({}, analysis, { id: uuid.v4() }),
                    consortiumId,
                    type: CONSORTIUM_ADD_ANALYSIS,
                });
            })
            .catch(reject);
    });
}

export function editAnalysis(consortiumId, analysisId, analysis) {
    return {
        analysis,
        consortiumId,
        id: analysisId,
        type: CONSORTIUM_EDIT_ANALYSIS,
    };
}

export function removeAnalysis(consortiumId, analysisId) {
    return {
        consortiumId,
        id: analysisId,
        type: CONSORTIUM_REMOVE_ANALYSIS,
    };
}

/**
 * Results consortium actions/action creators.
 */

export const CONSORTIUM_ADD_RESULT = 'CONSORTIUM_ADD_RESULT';
export const CONSORTIUM_EDIT_RESULT = 'CONSORTIUM_EDIT_RESULT';
export const CONSORTIUM_REMOVE_RESULT = 'CONSORTIUM_REMOVE_RESULT';

export function addResult(consortiumId, result) {
    return {
        consortiumId,
        result,
        type: CONSORTIUM_ADD_RESULT,
    };
}

export function editResult(consortiumId, resultId, result) {
    return {
        consortiumId,
        id: resultId,
        result,
        type: CONSORTIUM_EDIT_RESULT,
    };
}

export function removeResult(consortiumId, resultId) {
    return {
        consortiumId,
        id: resultId,
        type: CONSORTIUM_REMOVE_RESULT,
    };
}


import { getResults } from '../services/consortium-analyses-results';

/**
 * Consortium analyses results fetching.
 *
 * @todo  Move to a more appropriate result-centered actions file.
 */

export const CONSORTIUM_RESULTS_RECEIVE = 'CONSORTIUM_RESULTS_RECEIVE';
export const CONSORTIUM_RESULTS_REQUEST = 'CONSORTIUM_RESULTS_REQUEST';

export function fetchResults(consortiumId) {
    return dispatch => {
        dispatch(requestResults(consortiumId));
        getResults(consortiumId)
            .then(results => dispatch(receiveResults(consortiumId, results)))
            .catch(error => dispatch(consortiumError(error)));
    }
}

function requestResults(consortiumId) {
    return {
        consortiumId: consortiumId,
        type: CONSORTIUM_RESULTS_REQUEST,
    };
}

function receiveResults(consortiumId, results) {
    return {
        consortiumId: consortiumId,
        results,
        type: CONSORTIUM_RESULTS_RECEIVE,
    }
}
