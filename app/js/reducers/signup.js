import { SET_SIGNUP_USER } from '../actions/';

const initialState = {
    user: {}
};

export default function reduce(state = initialState, action) {
    switch (action.type) {

        case SET_SIGNUP_USER:
            return Object.assign({}, state, {
                user: action.user || {}
            });

        default:
            return state;
    }
    return state;
};
