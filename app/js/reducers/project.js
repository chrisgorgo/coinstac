import {
    SET_PROJECT,
    SET_PROJECT_CONSORTIUM_CTX,
    SET_PROJECT_CONSORTIUM_ANALYSIS_CTX,
    SET_PROJECT_ANALYSES_BY_SHA
} from '../actions/';

const initialState = {};

export default function reduce(state = initialState, action) {
    switch (action.type) {
        case SET_PROJECT:
            return Object.assign({}, state, action.project);

        case SET_PROJECT_CONSORTIUM_CTX:
            return Object.assign({}, state, { consortium: action.consortium });

        case SET_PROJECT_CONSORTIUM_ANALYSIS_CTX:
            let newState = Object.assign({}, state);
            if (!newState.consortium) {
                throw new ReferenceError('attempted to set analysis on non-existant consortium');
            }
            newState.consortium.ui_selectedAnalysis = action.analysisId;
            return newState;

        case SET_PROJECT_ANALYSES_BY_SHA:
            if (!state.consortium) {
                return state;  // only set analysesBySha when a consoritum ctx is set
            }
            const nextConsortium = Object.assign(state.consortium || {}, { analysesBySha: action.analysesBySha });
            return Object.assign({}, state, {consortium: nextConsortium });

        default:
            return state;
    }
    if (!action.type) {
        return state;
    }
    throw new ReferenceError(`no reduction specfied for ${action.type}`);
};
