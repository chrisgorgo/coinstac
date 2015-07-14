'use strict';

import React from 'react';
import { Nav } from 'react-bootstrap';
import { NavItemLink } from 'react-router-bootstrap';

export default class DashboardNav extends React.Component {
    render() {
        return (
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
                    <span className="glyphicon glyphicon-file" aria-hidden="true"></span>
                    Files
                </NavItemLink>
            </Nav>
        )
    }
}
