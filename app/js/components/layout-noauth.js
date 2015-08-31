'use strict';

import React from 'react';
import {Nav, NavItem} from 'react-bootstrap';
import { RouteHandler } from 'react-router';
import { NavItemLink } from 'react-router-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as allActions from '../actions/index';

class LayoutNoAuth extends React.Component {
    render() {
        const actions = bindActionCreators(allActions, this.props.dispatch);
        return (
            <div className="screen account">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-xs-12 col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4">
                            <div className="screen__content">
                                <h1 className="logo text-center">
                                    <abbr title="Collaborative Informatics and Neuroimaging Suite Toolkit for Anonymous Computation">COINSTAC</abbr>
                                </h1>
                                <Nav bsStyle='pills' justified>
                                    <NavItemLink to="login">Log In</NavItemLink>
                                    <NavItemLink to="signup">Sign Up</NavItemLink>
                                </Nav>
                                <RouteHandler {...actions} {...this.props} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

function select(state) { return state; };
export default connect(select)(LayoutNoAuth);
