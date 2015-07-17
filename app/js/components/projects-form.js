'use strict';

import React from 'react';
import Router from '../routes';
import { Input, ButtonToolbar, Button } from 'react-bootstrap';
import request from 'browser-request';
// import { files, consortia, myProjects } from '../stores/store';
import projects from '../services/projects';
import consortia from '../services/consortia';

export default class ProjectsForm extends React.Component {
    static propTypes: {
        projectId: React.PropTypes.string
    }
    constructor(props) {
        super(props);

        this.state = {
            consortia: [],
            errors: {},
            files: [],
            project: {}
        };
    }

    componentWillMount() {
        if (this.props.projectId) {
            projects.find(this.props.projectId)
                .then(project => this.setState({ project }))
                .catch(err => console.error(err));
        }

        consortia.getAll()
            .then(consortia => this.setState({ consortia }))
            .catch(err => console.error(err));
    }

    handleNameChange(event) {
        const { target: { value } } = event;
        const { project } = this.state;
        const { errors } = this.state;

        if (value) {
            delete errors.name;
        }
        project.name = value;
        this.setState({ project, errors });
    }
    handleConsortiumChange(event) {
        const errors = this.state.errors;

        if (event.target.value) {
            delete errors.consortium;
        }
        this.setState({ errors });
    }
    handleSave(e) {
        e.preventDefault();

        const name = this.refs.name.getValue().trim();
        const consortium = this.refs.consortium.getValue();
        const files = this.refs.files.getValue();
        const { errors } = this.state;

        if (!name) {
            errors.name = 'Name required.';
        } else {
            delete errors.name;
        }

        if (!consortium) {
            errors.consortium = 'Pick a consortium';
        } else {
            delete errors.consortium;
        }

        // Show errors if they exist. Otherwise, submit changes.
        if (Object.keys(errors).length) {
            this.setState({ errors });
        } else {
            // TODO: Enforce project schema somewhere. Not here.
            if (this.props.projectId) {
                let { project } = this.state;

                // Update project
                project.name = name;
                project.consortium = consortium;
                project.files = files;

                projects.update(project)
                    .then(() => Router.transitionTo('projects'))
                    .catch(err => console.error(err));
            } else {
                // Add new
                projects.add({ name, consortium, files })
                    .then(project => {
                        console.log(this, project);
                        debugger;
                        Router.transitionTo('projects');
                    })
                    .catch(err => console.error(err));
                }
        }
    }
    render() {
        const { consortia, files, project } = this.state;
        const projectName = project.name || '';
        const projectConsortium = project.consortium || [];
        const projectFiles = [];
        let nameErrors;
        let consortiumErrors;

        // Is the form for a new project? Change button text
        const buttonText = projectName ? 'Update' : 'Save';

        if (Object.keys(this.state.errors).length) {
            if (this.state.errors.name) {
                nameErrors = {
                    bsStyle: 'error',
                    help: this.state.errors.name,
                    hasFeedback: true
                };
            }
            if (this.state.errors.consortium) {
                consortiumErrors = {
                    bsStyle: 'error',
                    help: this.state.errors.consortium,
                    hasFeedback: true
                };
            }
        }

        return (
            <form onSubmit={this.handleSave.bind(this)} className="clearfix">
                <Input
                    ref="name"
                    type="text"
                    label="Name:"
                    value={projectName}
                    onChange={this.handleNameChange.bind(this)}
                    {...nameErrors} />
                <Input
                    ref="consortium"
                    type="select"
                    label="Consortia:"
                    onChange={this.handleConsortiumChange.bind(this)}
                    {...consortiumErrors}>
                    <option selected disabled value="">Choose…</option>
                    {consortia.map(consortium => {
                        // TODO: Implement multiple consortia select
                        const isSelected = projectConsortium === consortium._id;
                        return (
                            <option value={consortium._id} selected={isSelected}>
                                {consortium.label}
                            </option>
                        );
                    })}
                </Input>
                <Input
                    ref="files"
                    type="select"
                    label="Files:"
                    help="Choose some files to share."
                    multiple>
                    {files.map(file => {
                        const isSelected = projectFiles.indexOf(file) > -1;
                        return (
                            <option value={file.sha} selected={isSelected}>
                                {file.filename}
                            </option>
                        );
                    })}
                </Input>
                <ButtonToolbar className="pull-right">
                    <Button bsStyle="link">
                        <span className="glyphicon glyphicon-remove" aria-hidden="true">&nbsp;</span>
                        Cancel
                    </Button>
                    <Button
                        onClick={this.handleSave.bind(this)}
                        bsStyle="primary">
                        <span className="glyphicon glyphicon-ok" aria-hidden="true">&nbsp;</span>
                        {buttonText}
                    </Button>
                </ButtonToolbar>
            </form>
        );
    }
};
