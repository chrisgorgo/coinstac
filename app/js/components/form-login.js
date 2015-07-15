import React from 'react';
import {Input, Button} from 'react-bootstrap';
import _ from 'lodash';
import {ButtonLink} from 'react-router-bootstrap';

export default class FormLogin extends React.Component {
    handleFormSubmission(e) {
        e.preventDefault();
        let refs = _.assign(this.refs);
    }
    render() {
        return (
            <div>
                <div className="panel panel-default">
                    <div className="panel-body">
                        <form onSubmit={this.handleFormSubmission.bind(this)}>
                            <Input
                                type="text"
                                label="Username:"
                                ref="login-username"
                                labelClassName="control-label" />
                            <Input
                                type="password"
                                label="Password:"
                                ref="login-password"
                                labelClassName="control-label" />
                            <Button
                                bsStyle="primary"
                                type="submit"
                                block>Log In</Button>
                        </form>
                    </div>
                </div>
                <ButtonLink to="dashboard" block>HOT ROUTE</ButtonLink>
                <Button bsStyle="link" block>Forgot Password?</Button>
            </div>
        );
    }
}
