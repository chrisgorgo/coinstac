import { SET_CONSORTIA } from '../actions/';

export default function reduce(state = {}, action) {
    switch (action.type) {

        case SET_CONSORTIA:
            return action.consortia;
        default:
            return state;
    }
    return state;
};
