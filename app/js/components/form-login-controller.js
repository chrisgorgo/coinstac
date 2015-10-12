import _ from 'lodash';
import app from 'ampersand-app';
import React, { Component } from 'react';

import auth from '../services/auth';
import FormLogin from './form-login';
import User from '../models/user';

export default class FormLoginController extends Component {
    constructor(props) {
        super(props);
        this.hotRoute = this.hotRoute.bind(this);
        this.submit = this.submit.bind(this);
    }

    /**
     * Expose dummy login functionality.
     *
     * @todo  Remove the hot route for actual authentication.
     */
    hotRoute() {
        const user = auth.setUser({
            username: 'admin',
            name: 'Admin McAdmin',
            institution: 'BillBraskeyLTD',
            email: 'heyo',
        });

        app.notifications.push({
            message: 'Welcome ' + user.name,
            level: 'success'
        });
        app.router.transitionTo('/home');
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
            <FormLogin
                ref="logon"
                hotRoute={this.hotRoute}
                submit={this.submit} />
        );
    }
}
