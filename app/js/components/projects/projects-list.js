import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router';
import _ from 'lodash';
import dbs from '../../services/db-registry';
const projectsDb = dbs.get('projects');

export default class ProjectsList extends React.Component {

    componentWillMount() {
        projectsDb.all().then(projects => {
            this.setState({ projects });
        });
    }

    deleteProject(project) {
        projectsDb.delete(project)
            .then(() => {
                return projectsDb.all();
            })
            .then((projects) => {
                this.setState({ projects });
            })
            .catch(err => console.error(err));
    }

    render() {
        const projects = (this.state || {}).projects || [];
        return (
            <div className="projects-list">
                {projects.map(project => {
                    return (
                        <div key={project._id} className="project panel panel-default">
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
