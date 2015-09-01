import React from 'react';
import {Input, Button} from 'react-bootstrap';
import _ from 'lodash';

export default class FormLogin extends React.Component {

    data() {
        return {
            username: this.refs.username,
            password: this.refs.password
        };
    }

    render() {
        return (
            <div>
                <div className="panel panel-default">
                    <div className="panel-body">
                        <form onSubmit={this.props.submit}>
                            <Input
                                type="text"
                                label="Username:"
                                ref="username"
                                labelClassName="control-label" />
                            <Input
                                type="password"
                                label="Password:"
                                ref="password"
                                labelClassName="control-label" />
                            <Button
                                bsStyle="primary"
                                type="submit"
                                block>Log In</Button>
                        </form>
                    </div>
                </div>
                <Button onClick={this.props.hotRoute} block>HOT ROUTE</Button>
                <Button bsStyle="link" block>Forgot Password?</Button>
            </div>
        );
    }
};
