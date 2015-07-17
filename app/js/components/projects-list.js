'use strict';

import React from 'react';
import { Button } from 'react-bootstrap';
import { ButtonLink } from 'react-router-bootstrap';
import { Link } from 'react-router';
import _ from 'lodash';
import projects from '../services/projects';

export default class ProjectsList extends React.Component {
    componentWillMount() {
        projects.all().then(projects => {
            this.setState({ projects });
        });
    }
    deleteProject(project) {
        projects.delete(project._id)
            .then(() => {
                let { projects } = this.state;

                // TODO: This mutates `projects`! Find a better way.
                _.remove(projects, item => item._id === project._id);

                this.setState({ projects });
            })
            .catch(err => console.error(err));
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
                        <div className="project panel panel-default">
                            <div className="panel-body">
                                <h4>
                                    <Link
                                        to="projects-single"
                                        params={{ projectId: project._id }}>
                                        {project.name}
                                    </Link>
                                </h4>
                                <p>ID: {project._id}</p>
                                <Button
                                    bsStyle="danger"
                                    onClick={this.deleteProject.bind(this, project)}>
                                    Delete
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }
};
