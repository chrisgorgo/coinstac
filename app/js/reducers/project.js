import { SET_PROJECT } from '../actions/';

const initialState = {

};


export default function reduce(state = initialState, action) {
    switch (action.type) {

        case SET_PROJECT:
            debugger;
            return Object.assign({}, ...state, action.project);

        default:
            return state;
    }
    return state;
};
