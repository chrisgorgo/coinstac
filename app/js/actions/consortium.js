import uuid from 'uuid';

import Consortium from '../services/consortium';

/**
 * Consortium retrieval.
 */

export const CONSORTIUM_RECIEVE = 'CONSORTIUM_RECIEVE';
export const CONSORTIUM_REQUEST = 'CONSORTIUM_REQUEST';
export const CONSORTIUM_ERROR = 'CONSORTIUM_ERROR';

export function fetchConsortium(id) {
    return dispatch => {
        dispatch(requestConsortium(id));
        Consortium.get(id)
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
        type: CONSORTIUM_RECIEVE,
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

export function addTag(tag) {
    return {
        tag,
        type: CONSORTIUM_ADD_TAG,
    };
}

export function editTag(oldTag, newTag) {
    return {
        newTag,
        oldTag,
        type: CONSORTIUM_EDIT_TAG,
    };
}

export function removeTag(tag) {
    return {
        tag,
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
    return {
        analysis: Object.assign({}, analysis, { id: uuid.v4() }),
        consortiumId,
        type: CONSORTIUM_ADD_ANALYSIS,
    };
}

export function editAnalysis(consortiumId, id, analysis) {
    return {
        analysis,
        consortiumId,
        type: CONSORTIUM_EDIT_ANALYSIS,
    };
}

export function removeAnalysis(consortiumId, id) {
    return {
        consortiumId,
        id,
        type: CONSORTIUM_REMOVE_ANALYSIS,
    };
}

/**
 * Results consortium actions/action creators.
 */

export const CONSORTIUM_ADD_RESULTS = 'CONSORTIUM_ADD_RESULTS';
export const CONSORTIUM_EDIT_RESULTS = 'CONSORTIUM_EDIT_RESULTS';
export const CONSORTIUM_REMOVE_RESULTS = 'CONSORTIUM_REMOVE_RESULTS';

export function addResults(results) {
    return {
        results,
        type: CONSORTIUM_ADD_RESULTS,
    };
}

export function editResults(results) {
    return {
        results,
        type: CONSORTIUM_EDIT_RESULTS,
    };
}

export function removeResults(id) {
    return {
        id,
        type: CONSORTIUM_ADD_RESULTS,
    };
}
