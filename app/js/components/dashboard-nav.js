'use strict';
import app from 'ampersand-app';
import React from 'react';
import { Nav } from 'react-bootstrap';
import { NavItemLink } from 'react-router-bootstrap';

export default class DashboardNav extends React.Component {
    render() {
        const isHome = app.router.getCurrentPath() === '/';

        return (
            <Nav bsStyle="pills" stacked>
                <NavItemLink to="dashboard" active={isHome}>
                    <span className="glyphicon glyphicon-home" aria-hidden="true"></span>
                    Home
                </NavItemLink>
                <NavItemLink to="consortia">
                    <span className="glyphicon glyphicon-list" aria-hidden="true"></span>
                    Consortia
                </NavItemLink>
                <NavItemLink to="projects">
                    <span className="glyphicon glyphicon-list-alt" aria-hidden="true"></span>
                    Projects
                </NavItemLink>
            </Nav>
        )
    }
}
