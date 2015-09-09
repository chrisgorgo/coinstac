import { Button, Input } from 'react-bootstrap';
import React, { Component, PropTypes } from 'react';

class FormLogin extends Component {
    data() {
        return {
            username: this.refs.username.getValue(),
            password: this.refs.password.getValue(),
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

FormLogin.propTypes = {
    hotRoute: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired,
};

export default FormLogin;
