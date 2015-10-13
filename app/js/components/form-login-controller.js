import _ from 'lodash';
import app from 'ampersand-app';
import React, { Component } from 'react';

import auth from '../services/auth';
import FormLogin from './form-login';
import User from '../models/user';

export default class FormLoginController extends Component {
    constructor(props) {
        super(props);
        this.submit = this.submit.bind(this);
    }
    submit(e) {
        e.preventDefault();

        auth.login(this.refs.logon.data())
            .then(user => {
                app.notifications.push({
                    message: `Welcome, ${user.label}!`,
                    level: 'success'
                });
                app.router.transitionTo('home');
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
            <FormLogin ref="logon" submit={this.submit} />
        );
    }
}
