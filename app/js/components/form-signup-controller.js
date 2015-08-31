import app from 'ampersand-app';
import React from 'react';
import {Input, Button} from 'react-bootstrap';
import FieldPassword from './field-password';
import _ from 'lodash';
import axios from 'axios'
import auth from '../services/auth';
import config from 'config';
import User from '../models/user';

import FormSignup from './form-signup';

export default class FormSignupController extends React.Component {

    submit(e) {
        e.preventDefault();
        let refs = _.assign(this.refs);
        let userData = {
            encoded: btoa(JSON.stringify(this.refs.signup.data()))
        };
        return axios({
            method: 'post',
            url: config.api.url + '/users',
            data: userData
        })
        .then(response => {
            const userData = response.data.data[0];
            app.notifications.push({
                message: 'Registration successful',
                level: 'success'
            });
            app.router.transitionTo('login');
            this.props.setSignupUser(null);
        }.bind(this));
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
