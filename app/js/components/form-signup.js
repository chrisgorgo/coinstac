import app from 'ampersand-app';
import React from 'react';
import {Input, Button} from 'react-bootstrap';
import FieldPassword from './field-password';

export default class FormSignup extends React.Component {

    data() {
        return {
            name: this.refs['signup-name'].getInputDOMNode().value,
            username: this.refs['signup-username'].getInputDOMNode().value,
            password: this.refs.password.state.password,
            email:  this.refs.email.getInputDOMNode().value,
            institution: this.refs.institution.getInputDOMNode().value
        };
    }

    render() {
        return (
            <div className="panel panel-default">
                <div className="panel-body">
                    <form onSubmit={this.props.submit.bind(this)}>
                        <Input
                            onChange={this.props.handleFieldChange.bind(this)}
                            type="text"
                            value={this.props.user.name}
                            label="Name:"
                            ref="signup-name" />
                        <Input
                            onChange={this.props.handleFieldChange.bind(this)}
                            value={this.props.user.username}
                            type="text"
                            label="Username:"
                            ref="signup-username" />
                        <Input
                            onChange={this.props.handleFieldChange.bind(this)}
                            value={this.props.user.email}
                            type="email"
                            label="Email:"
                            ref="email" />
                        <FieldPassword
                            onChange={this.props.handleFieldChange.bind(this)}
                            validation={true}
                            ref="password" />
                        <Input
                            onChange={this.props.handleFieldChange.bind(this)}
                            value={this.props.user.institution}
                            type="select"
                            label="Institution:"
                            ref="institution"
                            help="(Optional)" />
                        <Button
                            bsStyle="primary"
                            type="submit"
                            disabled={!this.props.user.valid}
                            block>Sign Up</Button>
                    </form>
                </div>
            </div>
        )
    }
}
