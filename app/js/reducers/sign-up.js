import { SIGN_UP } from '../actions/';

const initialState = {
};

export default function signUp(state = initialState, action) {
    switch (action.type) {
        case SIGN_UP:
            return Object.assign({}, state, {
                user: action.user
            });

        return state;
    }
    return state;
};
