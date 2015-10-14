import app from 'ampersand-app';
import React, { Component, PropTypes } from 'react';

import auth from '../services/auth';
import FormLogin from './form-login';
import LayoutNoauth from './layout-noauth';

class FormLoginController extends Component {
    constructor(props) {
        super(props);
        this.submit = this.submit.bind(this);
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
                <FormLogin ref="logon" submit={this.submit} />
            </LayoutNoauth>
        );
    }
}

FormLoginController.displayName = 'FormLoginController';

FormLoginController.propTypes = {
    history: PropTypes.object.isRequired,
};

export default FormLoginController;
