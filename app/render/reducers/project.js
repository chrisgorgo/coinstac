import {
    PROJECT_FILE_CHANGE_CONTROL_TAG,
    SET_PROJECT,
    SET_PROJECT_CONSORTIUM_CTX,
    SET_PROJECT_CONSORTIUM_ANALYSIS_CTX
} from '../actions/';

const initialState = {};

export default function reduce(state = initialState, action) {
    switch (action.type) {
        case SET_PROJECT:
            if (!action.project) {
                return; // clear project state
            }
            return Object.assign({}, state, action.project);

        case SET_PROJECT_CONSORTIUM_CTX:
            if (!action.consortium) {
                delete state.consortium;
                return Object.assign({}, state);
            }
            return Object.assign({}, state, { consortium: action.consortium });

        case SET_PROJECT_CONSORTIUM_ANALYSIS_CTX:
            let newState = Object.assign({}, state);
            if (!newState.consortium) {
                throw new ReferenceError('attempted to set analysis on non-existant consortium');
            }
            newState.consortium.ui_selectedAnalysis = action.analysisId;
            return newState;

        case PROJECT_FILE_CHANGE_CONTROL_TAG:
            return Object.assign({}, state, {
                files: state.files.map(file => {
                    if (file.sha === action.fileSha) {
                        file.tags.control = action.value;
                    }
                    return file;
                }),
            });

        default:
            return state;
    }
    if (!action.type) {
        return state;
    }
    throw new ReferenceError(`no reduction specfied for ${action.type}`);
};
