'use strict';

import React from 'react';
import {Input, Button} from 'react-bootstrap';
import _ from 'lodash';

export default class FormSignup extends React.Component {
    handleFormSubmission(e) {
        e.preventDefault();

        let refs = _.assign(this.refs);
    }
    render() {
        return (
            <div className="panel panel-default">
                <div className="panel-body">
                    <form onSubmit={this.handleFormSubmission.bind(this)}>
                        <Input
                            type="text"
                            label="Name:"
                            ref="signup-name" />
                        <Input
                            type="text"
                            label="Username:"
                            ref="signup-username" />
                        <Input
                            type="password"
                            label="Password:"
                            ref="signup-password" />
                        <Input
                            type="password"
                            label="Confirm Password:"
                            ref="signup-password-confirm" />
                        <Input
                            type="select"
                            label="Institution:"
                            help="(Optional)" />
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
