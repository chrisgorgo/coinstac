import app from 'ampersand-app';
import React, { Component, PropTypes } from 'react';

import auth from '../services/auth';
import FormSignup from './form-signup';
import User from '../models/user';

function errorHandler(error) {
    let message;

    if (error.message) {
        message = error.message;
    } else if (typeof error === 'string') {
        message = error;
    } else {
        message = 'Signup error occurred. Please try again.';
    }

    app.notifications.push({
        level: 'error',
        message,
    });
}

class FormSignupController extends Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

    /**
     * Handle new user form submits.
     *
     * @todo  Improve form validation, move Redux action or middleware.
     *
     * @param  {object}    formData
     * @param  {string}    formData.email
     * @param  {string}    formData.institution
     * @param  {string}    formData.name
     * @param  {string}    formData.password
     * @param  {string}    formData.username
     * @return {undefined}
     */
    onSubmit(formData) {
        let error;

        if (!formData.name) {
            error = 'Name required';
        } else if (!formData.username) {
            error = 'Username required';
        } else if (!formData.email) {
            error = 'Email required';
        } else if (!formData.password) {
            error = 'Password required';
        } else if (formData.password.length < 8) {
            error = 'Password must be at least 8 characters long';
        } else if (!formData.institution) {
            error = 'Institution required';
        }

        if (error) {
            return errorHandler(error);
        }

        try {
            const user = new User(formData);

            if (!user.isValid()) {
                throw new Error('Invalid user');
            }

            auth.createUser(formData)
                .then(response => {
                    this.props.setSignupUser(user.serialize());
                    app.router.transitionTo('home');
                })
                .catch(response => errorHandler(response.data.error));
        } catch (error) {
            errorHandler(error);
        }
    }

    render() {
        return (
            <FormSignup onSubmit={this.onSubmit} />
        );
    }
}

FormSignupController.displayName = 'FormSignupController';

FormSignupController.propTypes = {
    setSignupUser: PropTypes.func.isRequired,
};

export default FormSignupController;
