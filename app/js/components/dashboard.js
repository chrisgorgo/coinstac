'use strict';

import React from 'react';
import { Nav } from 'react-bootstrap';
import { NavItemLink } from 'react-router-bootstrap';
import { RouteHandler } from 'react-router';

export default class Dashboard extends React.Component {
    render() {
        return (
            <div className="dashboard container-fluid">
                <div className="row">
                    <div className="col-xs-12 col-sm-4">
                        <nav className="navigation" role="navigation">
                            <h1 className="logo text-center">
                                <abbr title="Collaborative Informatics and Neuroimaging Suite Toolkit for Anonymous Computation">COINSTAC</abbr>
                            </h1>
                            <Nav bsStyle="pills" stacked>
                                <NavItemLink to="dashboard">
                                    <span className="glyphicon glyphicon-home" aria-hidden="true"></span>
                                    Home
                                </NavItemLink>
                                <NavItemLink to="consortia">
                                    <span className="glyphicon glyphicon-list" aria-hidden="true"></span>
                                    Consortia
                                </NavItemLink>
                                <NavItemLink to="files">
                                    <span class="glyphicon glyphicon-file" aria-hidden="true"></span>
                                    Files
                                </NavItemLink>
                            </Nav>
                            <div className="user-account">
                                <div className="media">
                                    <div className="media-left">
                                        <img className="media-object img-rounded" src="images/avatar.jpg" alt="Kitty McFeline’s avatar" width="50" height="50" />
                                    </div>
                                    <div className="media-body">
                                        <strong className="block">Dr. Kitty McFeline</strong>
                                        <br />
                                        <em className="h6">Institution Name</em>
                                    </div>
                                </div>
                            </div>
                        </nav>
                    </div>
                    <div className="col-xs-12 col-sm-8">
                        <RouteHandler />
                    </div>
                </div>
            </div>
        );
    }
};
