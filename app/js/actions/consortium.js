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

export const CONSORTIUM_ADD_RESULTS = 'CONSORTIUM_ADD_RESULTS';
export const CONSORTIUM_EDIT_RESULTS = 'CONSORTIUM_EDIT_RESULTS';
export const CONSORTIUM_REMOVE_RESULTS = 'CONSORTIUM_REMOVE_RESULTS';

export function addResults(consortiumId, results) {
    return {
        consortiumId,
        results,
        type: CONSORTIUM_ADD_RESULTS,
    };
}

export function editResults(consortiumId, resultsId, results) {
    return {
        consortiumId,
        id: resultsId,
        results,
        type: CONSORTIUM_EDIT_RESULTS,
    };
}

export function removeResults(consortiumId, resultsId) {
    return {
        consortiumId,
        id: resultsId,
        type: CONSORTIUM_ADD_RESULTS,
    };
}
