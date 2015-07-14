'use strict';
import React from 'react';
import {Input} from 'react-bootstrap';

export default class FieldPassword extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            hasFeedback: false,
            help: '',
            validationClass: ''
        };
    }
    handleConfirmChange(evt) {
         let password = this.refs.password.getInputDOMNode().value; // React.findDOMNode(this.refs.password).querySelector('input');
        let confirmPassword = this.refs.confirm.getInputDOMNode().value;
        let state = {hasFeedback: true};
        if (password === confirmPassword) {
            state.help = '';
            state.validationClass = 'success'
        } else {
            state.help = 'Passwords do not match';
            state.validationClass = 'error'
        }
        this.setState(state);
    }
    render() {
        return (
            <div>
                <Input
                    bsStyle={this.state.validationClass}
                    type="password"
                    label="Password:"
                    ref="password"
                    onChange={this.handleConfirmChange.bind(this)}
                    hasFeedback={this.state.hasFeedback} />
                <Input
                    bsStyle={this.state.validationClass}
                    type="password"
                    label="Confirm Password:"
                    onChange={this.handleConfirmChange.bind(this)}
                    ref="confirm"
                    help={this.state.help}
                    hasFeedback={this.state.hasFeedback} />
            </div>
        )
    }
};
