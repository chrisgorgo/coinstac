'use strict';

import React from 'react';
import { RouteHandler } from 'react-router';

export default class Projects extends React.Component {
    render() {
        return (
            <div className="projects">
                <div className="page-header">
                    <h1>Projects</h1>
                </div>
                <RouteHandler />
            </div>
        );
    }
}
