// TODO add validation styles to <Input>s
'use strict';

import React from 'react';
import {Input, Button} from 'react-bootstrap';
import FieldPassword from './field-password';
// import FieldEmail from './field-email' // TODO debug `Input` not being extended
import _ from 'lodash';
import request from 'browser-request'
import auth from '../services/auth';
import config from 'config';

export default class FormSignup extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            disableSubmit: true
        };
    }
    handleFormSubmission(e) {
        e.preventDefault();
        let refs = _.assign(this.refs);
        let userData = {
            encoded: btoa(JSON.stringify(this.data()))
        };
        request.post({
            url: config.api.url + '/users',
            json: userData
        }, function(err, response, body) {
            // TODO API response not standard
            _.assign(userData, {id: body});
            auth.setUser(userData);
        });
    }
    data() {
        return {
            username: this.refs['signup-username'].getInputDOMNode().value,
            password: this.refs.password.state.password,
            email:  this.refs.email.getInputDOMNode().value,
            institution: this.refs.institution.getInputDOMNode().value,
            name: this.refs['signup-name'].getInputDOMNode().value
        };
    }
    handleFieldChange(evt) {
        let data = this.data();
        let state = this.state;

        if (!data.username || !data.password || !data.email || !data.name) {
            state.disableSubmit = true;
        } else {
            state.disableSubmit = false;
        }
        this.setState(state);
    }
    render() {
        return (
            <div className="panel panel-default">
                <div className="panel-body">
                    <form onSubmit={this.handleFormSubmission.bind(this)}>
                        <Input
                            onChange={this.handleFieldChange.bind(this)}
                            type="text"
                            label="Name:"
                            ref="signup-name" />
                        <Input
                            onChange={this.handleFieldChange.bind(this)}
                            type="text"
                            label="Username:"
                            ref="signup-username" />
                        <Input
                            onChange={this.handleFieldChange.bind(this)}
                            type="email"
                            label="Email:"
                            ref="email" />
                        <FieldPassword
                            onChange={this.handleFieldChange.bind(this)}
                            validation={true}
                            ref="password" />
                        <Input
                            onChange={this.handleFieldChange.bind(this)}
                            type="select"
                            label="Institution:"
                            ref="institution"
                            help="(Optional)" />
                        <Button
                            bsStyle="primary"
                            type="submit"
                            disabled={this.state.disableSubmit}
                            block>Sign Up</Button>
                    </form>
                </div>
            </div>
        )
    }
}
