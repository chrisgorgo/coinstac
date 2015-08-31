/*
 * action types
 */
export const SET_SIGNUP_USER = 'SET_SIGNUP_USER';

/*
 * action creators
 */
export function setSignupUser(user) {
    return { type: SET_SIGNUP_USER, user };
}
