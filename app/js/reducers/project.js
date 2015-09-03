import { SET_PROJECT, SET_PROJECT_CONSORTIUM_CTX } from '../actions/';

const initialState = {};

export default function reduce(state = initialState, action) {
    switch (action.type) {

        case SET_PROJECT:
            return Object.assign({}, state, action.project);

        case SET_PROJECT_CONSORTIUM_CTX:
            return Object.assign({}, state, { consortium: action.consortium });

        default:
            return state;
    }
    return state;
};
