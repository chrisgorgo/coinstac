'use strict';
import Router from '../../routes';
import Project from '../../models/project.js'
import React from 'react';
import { Input, ButtonToolbar, Button } from 'react-bootstrap';
export default class FormAddProject extends React.Component {

    constructor() {
        super();
        this.state = {
            consortia: [],
            errors: {},
            files: [],
            project: {}
        };
    }

    handleSave(evt) {
        evt.preventDefault();
        const name = this.refs.name.getValue().trim();
        const { errors } = this.state;

        if (!name) {
            errors.name = 'Name required.';
        } else {
            delete errors.name;
        }

        // Show errors if they exist. Otherwise, submit changes.
        if (Object.keys(errors).length) {
            return this.setState({ errors });
        }

        let project = new Project({ name });
        console.dir(project.serialize()); // TODO debuggins only
        dbs.get('projects')
        .all()
        .then(projects => {
            let duplicateName = projects.some((project) => { return project.name === name; });
            if (duplicateName) {
                throw {status: 409};
            }
        })
        .then(() => {
            return dbs.get('projects').add(project.serialize())
            .then(() => {
                app.notifications.push({
                    message: `Project '${name}' created`,
                    level: 'success'
                });
                Router.transitionTo('projects');
            });
        })
        .catch((err) => {
            if (err.status === 409) {
                return app.notifications.push({
                    message: `Project already exists with name: ${name}`,
                    level: 'error'
                });
            }
            throw error;
        });
    }

    render() {
        let nameErrors;
        let consortiumErrors;

        if (Object.keys(this.state.errors).length) {
            if (this.state.errors.name) {
                nameErrors = {
                    bsStyle: 'error',
                    help: this.state.errors.name,
                    hasFeedback: true
                };
           }
        };

        return (
            <div className="projects-new">
                <h3>New Project</h3>
                <form onSubmit={this.handleSave.bind(this)} className="clearfix">
                    <Input
                        ref="name"
                        type="text"
                        label="Name:"
                        {...nameErrors} />
                    <ButtonToolbar className="pull-right">
                        <Button
                            onClick={() => Router.transitionTo('projects')}
                            bsStyle="link">
                            <span className="glyphicon glyphicon-remove" aria-hidden="true">&nbsp;</span>
                            Cancel
                        </Button>
                        <Button
                            onClick={this.handleSave.bind(this)}
                            bsStyle="primary">
                            <span className="glyphicon glyphicon-ok" aria-hidden="true">&nbsp;</span>
                            Add
                        </Button>
                    </ButtonToolbar>
                </form>
            </div>
        );
    }
};
