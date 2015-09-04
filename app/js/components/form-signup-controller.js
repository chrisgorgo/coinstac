import app from 'ampersand-app';
import React, { Component } from 'react';
import { Input, Button } from 'react-bootstrap';

import auth from '../services/auth';
import FormSignup from './form-signup';
import User from '../models/user';

export default class FormSignupController extends Component {
    submit(e) {
        e.preventDefault();

        auth.createUser(this.refs.signup.data()).then(response => {
            const userData = response.data.data[0];
            app.notifications.push({
                message: 'Registration successful',
                level: 'success'
            });
            app.router.transitionTo('login');
            this.props.setSignupUser(null);
        }).catch(error => {
            app.notifications.push({
                message: error.message,
                level: 'error',
            });
        });
    }

    handleFieldChange(evt) {
        let rawUser = this.refs.signup.data();
        if (!rawUser.username || !rawUser.password || !rawUser.email || !rawUser.name) {
            rawUser.valid = false; // set user
            return this.props.setSignupUser(rawUser);
        }
        // detected valid user. assert validity by pumping user data into User model
        let user = new User(rawUser);
        rawUser = user.serialize();
        rawUser.valid = true;
        return this.props.setSignupUser(rawUser);
    }

    render() {
        let { signup } = this.props;
        return (
            <FormSignup ref="signup"
                user={signup.user}
                handleFieldChange={this.handleFieldChange.bind(this)}
                submit={this.submit.bind(this)} />
        );
    }
}
