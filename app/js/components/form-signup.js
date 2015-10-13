import app from 'ampersand-app';
import { Button, Input } from 'react-bootstrap';
import React, { Component, PropTypes } from 'react';

import FieldPassword from './field-password';

class FormSignup extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();

        /** @todo  Remove hard-coded institution. */
        this.props.onSubmit({
            email:  this.refs.email.getInputDOMNode().value,
            institution: 'mrn',
            name: this.refs['signup-name'].getInputDOMNode().value,
            password: this.refs.password.state.password,
            username: this.refs['signup-username'].getInputDOMNode().value,
        });
    }

    render() {
        return (
            <div className="panel panel-default">
                <div className="panel-body">
                    <form onSubmit={this.handleSubmit}>
                        <Input
                            type="text"
                            label="Name:"
                            ref="signup-name" />
                        <Input
                            type="text"
                            label="Username:"
                            ref="signup-username" />
                        <Input
                            type="email"
                            label="Email:"
                            ref="email" />
                        <FieldPassword
                            validation={true}
                            ref="password" />
                        <Button
                            bsStyle="primary"
                            type="submit"
                            block>Sign Up</Button>
                    </form>
                </div>
            </div>
        )
    }
}

FormSignup.displayName = 'FormSignup';

FormSignup.propTypes = {
    onSubmit: PropTypes.func.isRequired,
};

export default FormSignup;
