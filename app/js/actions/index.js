/*
 * action types
 */
export const SIGN_UP = 'SIGN_UP';

/*
 * action creators
 */
export function signUp(user) {
  return { type: SIGN_UP, user };
}
