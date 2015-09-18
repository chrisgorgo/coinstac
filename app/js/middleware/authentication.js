import _ from 'lodash';
import app from 'ampersand-app';
import { bindActionCreators } from 'redux';

import * as allActions from '../actions/'
import auth from '../services/auth';

let cachedActions;

const notifyAuthRequired = _.debounce(() => {
    return app.notifications.push({
        message: 'Please authenticate prior to using COINSTAC',
        level: 'error'
    });
}, 500);

/*
 * asserts that user is logged in or has auth in persistent storage in order
 * to use application. if app is just booting and auth is not yet in state,
 * set the auth
 */
const authentication = store => next => action => {
    const actions = cachedActions || bindActionCreators(allActions, store.dispatch);
    let result;
    // proceed on as usual if we are already logged on, or if we
    // are doing actions that do not require auth
    if (action.type === allActions.SET_USER ||
        action.type === allActions.SET_SIGNUP_USER ||
        store.getState().login.user.username) {
        result = next(action);
        return result;
    }
    let storedUser = auth.getUser();
    if (!storedUser) {
        if (app && app.notifications) {
            notifyAuthRequired();
        }
        app.router.transitionTo('/login');
    } else {
        actions.setUser(storedUser);
    }
    result = next(action);
    return result;
};

export default authentication;
