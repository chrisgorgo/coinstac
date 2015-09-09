import { SET_PROJECT, SET_PROJECT_CONSORTIUM_CTX, SET_PROJECT_ANALYSES_BY_SHA } from '../actions/';

const initialState = {};

export default function reduce(state = initialState, action) {
    switch (action.type) {
        case SET_PROJECT:
            return Object.assign({}, state, action.project);

        case SET_PROJECT_CONSORTIUM_CTX:
            return Object.assign({}, state, { consortium: action.consortium });

        case SET_PROJECT_ANALYSES_BY_SHA:
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
