/**
 * Consortium Middleware.
 *
 * Implement API interaction for consortium actions here. This keeps the action
 * creators simple by implementing async calls and handling here.
 *
 * @todo  Improve code for reuse, etc.
 */

import {
    CONSORTIUM_ADD_USER,
    CONSORTIUM_REMOVE_USER,
    consortiumError,
} from '../actions/consortium';
import Consortium from '../services/consortium';

export default store => next => action => {
    const { consortiumId, type, username } = action;

    /**
     * @todo  This is effectively a user object 'schema'. Write an effective
     *        way to enforce it.
     */
    action.user = { username };

    const nextAction = () => next(action);
    const errorHandler = error => next(consortiumError(error));

    switch (type) {
        case CONSORTIUM_ADD_USER:
            return Consortium.addUser(consortiumId, username)
                .then(nextAction, errorHandler);
        case CONSORTIUM_REMOVE_USER:
            return Consortium.removeUser(consortiumId, username)
                .then(nextAction, errorHandler);
        default:
            return nextAction();
    }
}
