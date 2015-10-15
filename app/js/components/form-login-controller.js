import app from 'ampersand-app';
import React, { Component, PropTypes } from 'react';

import auth from '../services/auth';
import clientIdentifier from '../../common/utils/client-identifier'; //TODO remove
import FormLogin from './form-login';
import LayoutNoauth from './layout-noauth';

class FormLoginController extends Component {
    constructor(props) {
        super(props);
        this.hotRoute = this.hotRoute.bind(this);
        this.submit = this.submit.bind(this);
    }

    /**
     * Allow users to log in without authentication.
     *
     * @todo  Remove for production.
     */
    hotRoute(event) {
        event.preventDefault();

        const { history: { pushState } } = this.props;

        auth.setUser({
            email: 'testuser@mrn.org',
            label: 'Test User',
            username: clientIdentifier,
        });
        pushState({ state: 'login' }, '/');
    }

    submit(e) {
        e.preventDefault();

        const { history: { pushState } } = this.props;

        auth.login(this.refs.logon.data())
            .then(user => {
                app.notifications.push({
                    message: `Welcome, ${user.label}!`,
                    level: 'success'
                });
                pushState({ state: 'login' }, '/');
            })
            .catch(error => {
                app.notifications.push({
                    message: 'Invalid username or password.  Please try again',
                    level: 'warning'
                });
                console.error(error);
            });
    }
    render() {
        return (
            <LayoutNoauth>
                <FormLogin
                    ref="logon"
                    hotRoute={this.hotRoute}
                    submit={this.submit} />
            </LayoutNoauth>
        );
    }
}

FormLoginController.displayName = 'FormLoginController';

FormLoginController.propTypes = {
    history: PropTypes.object.isRequired,
};

export default FormLoginController;
