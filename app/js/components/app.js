'use strict';

import React from 'react';
import {Nav, NavItem} from 'react-bootstrap';
import FormLogin from './form-login';
import FormSignup from './form-signup';

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            formType: 'login'
        };
    }
    handleFormChange(formType) {
        this.setState({formType: formType});
    }
    render() {
        let form;

        if (this.state.formType === 'login') {
            form = <FormLogin />;
        } else {
            form = <FormSignup />;
        }

        return (
            <div className="screen account">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-xs-12 col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4">
                            <div className="screen__content">
                                <h1 className="logo text-center">
                                    <abbr title="Collaborative Informatics and Neuroimaging Suite Toolkit for Anonymous Computation">COINSTAC</abbr>
                                </h1>
                                <Nav bsStyle='pills' justified activeKey={this.state.formType} onSelect={this.handleFormChange.bind(this)}>
                                    <NavItem eventKey={"login"}>Log In</NavItem>
                                    <NavItem eventKey={"signup"}>Sign Up</NavItem>
                                </Nav>
                                {form}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};
