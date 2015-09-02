'use strict';

import React from 'react';
import { RouteHandler } from 'react-router';
import { ButtonLink } from 'react-router-bootstrap';

export default class DashboardProjects extends React.Component {
    render() {
        return (
            <div className="projects">
                <div className="page-header clearfix">
                    <h1 className="pull-left">Projects</h1>
                    <ButtonLink
                        to="projects-new"
                        bsStyle="primary"
                        className="pull-right">
                        <strong>+</strong>
                        Add Project
                    </ButtonLink>
                </div>
                <RouteHandler />
            </div>
        );
    }
};
