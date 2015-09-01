/*
 * action types
 */
export const INIT = 'init';
export const SET_USER = 'SET_USER';
export const SET_SIGNUP_USER = 'SET_SIGNUP_USER';

/*
 * action creators
 */
export function init() {
    return {type: INIT};
};

export function setUser(user) {
    return { type: SET_USER, user };
};

export function setSignupUser(user) {
    return { type: SET_SIGNUP_USER, user };
};
