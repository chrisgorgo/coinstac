'use strict';

import React from 'react';
import { ButtonLink } from 'react-router-bootstrap';
import { Link } from 'react-router';
import * as store from '../stores/store';

export default class ProjectsList extends React.Component {
    render() {
        return (
            <div className="projects-list">
                <div className="clearfix">
                    <ButtonLink
                        to="projects-new"
                        bsStyle="primary"
                        className="pull-right">
                        Add Project
                    </ButtonLink>
                </div>
                {store.projectStore.map(project => {
                    return (
                        <div className="project">
                            <h4>
                                <Link
                                    to="projects-single"
                                    params={{ projectId: project.id }}>
                                    {project.name}
                                </Link>
                            </h4>
                            <p>ID: {project.id}</p>
                        </div>
                    );
                })}
            </div>
        );
    }
};
