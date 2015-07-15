// TODO add validation styles to <Input>s
'use strict';

import React from 'react';
import {Input, Button} from 'react-bootstrap';
import FieldPassword from './field-password'
import _ from 'lodash';
import xhr from 'xhr';

export default class FormSignup extends React.Component {
    handleFormSubmission(e) {
        e.preventDefault();
        let refs = _.assign(this.refs); // TODO send to API
        request.post();
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
                        <FieldPassword validation={true} />
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
