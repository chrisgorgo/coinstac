import app from 'ampersand-app';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';

import auth from '../services/auth';
import FormSignup from './form-signup';
import LayoutNoauth from './layout-noauth';
import { setSignupUser } from '../actions';
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
        const { history: { pushState } } = this.props;

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
                    pushState({ state: 'signup' }, '/');
                })
                .catch(response => errorHandler(response.data.error));
        } catch (error) {
            errorHandler(error);
        }
    }

    render() {
        return (
            <LayoutNoauth>
                <FormSignup onSubmit={this.onSubmit} />
            </LayoutNoauth>
        );
    }
}

FormSignupController.displayName = 'FormSignupController';

FormSignupController.propTypes = {
    history: PropTypes.object.isRequired,
    setSignupUser: PropTypes.func.isRequired,
};

/** @todo  Implement */
function mapStateToProps(state) {
    return {};
};

function mapDispatchToProps(dispatch) {
    return {
        setSignupUser: bindActionCreators(setSignupUser, dispatch),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FormSignupController);
