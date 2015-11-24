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
    CONSORTIUM_ADD_ANALYSIS,
    CONSORTIUM_REMOVE_ANALYSIS,
    consortiumError,
} from '../actions/consortium';
import consortium from '../services/consortium';

export default store => next => action => {
    const { analysis, consortiumId, id, type, username } = action;

    /**
     * @todo  This is effectively a user object 'schema'. Write an effective
     *        way to enforce it.
     */
    action.user = { username };

    const nextAction = () => next(action);

    switch (type) {
        case CONSORTIUM_ADD_USER:
            return consortium.addUser(consortiumId, username)
                .then(nextAction);
        case CONSORTIUM_REMOVE_USER:
            return consortium.removeUser(consortiumId, username)
                .then(nextAction);
        case CONSORTIUM_ADD_ANALYSIS:
            return consortium.addAnalysis(consortiumId, analysis)
                .then(nextAction);
        case CONSORTIUM_REMOVE_ANALYSIS:
            return consortium.removeAnalysis(consortiumId, id)
                .then(nextAction);
        default:
            return nextAction();
    }
}
