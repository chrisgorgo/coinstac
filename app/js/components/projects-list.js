'use strict';

import React from 'react';
import { ButtonLink } from 'react-router-bootstrap';
import { Link } from 'react-router';
import projects from '../services/projects';

export default class ProjectsList extends React.Component {
    componentWillMount() {
        projects.all().then(projects => {
            this.setState({ projects });
        });
    }
    render() {
        const projects = (this.state || {}).projects || [];
        console.log('Have projects:', projects);
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
                {projects.map(project => {
                    return (
                        <div className="project">
                            <h4>
                                <Link
                                    to="projects-single"
                                    params={{ projectId: project._id }}>
                                    {project.name}
                                </Link>
                            </h4>
                            <p>ID: {project._id}</p>
                        </div>
                    );
                })}
            </div>
        );
    }
};
