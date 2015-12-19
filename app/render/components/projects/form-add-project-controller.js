import app from 'ampersand-app';
import path from 'path';
import Project from 'models/project.js';
import React from 'react';
import FormAddProject from './form-add-project';
import uuid from 'uuid';
import dbs from '../../services/db-registry';
export default class FormAddProjectController extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            errors: {}
        };
    }

    handleClickCancel() {
        const { history: { pushState } } = this.props;

        pushState({ state: 'cancelNewProject' }, '/projects');
    }

    handleClickSave(evt) {
        evt.preventDefault();

        const { history: { pushState } } = this.props;
        const { name } = this.refs.add.data();
        const { errors } = this.state;
        let id;
        let project;

        if (!name) {
            errors.name = 'Name required';
        } else {
            delete errors.name;
        }

        // Show errors if they exist. Otherwise, submit changes.
        if (Object.keys(errors).length) {
            return this.setState({ errors });
        }

        id = uuid.v4();
        project = new Project({ _id: id, name });

        return dbs.get('projects').add(project.serialize())
            .then(() => {
                app.notifications.push({
                    level: 'success',
                    message: `Project '${name}' created`,
                });
                pushState({ state: 'createNewProject' }, `/projects/${id}`);
            })
            .catch(error => {
                app.notifications.push({
                    level: 'error',
                    message: error.message || error,
                });
                pushState({ state: 'projectError' }, '/projects');
            });
    }

    render() {
        let nameErrors = {};
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
            <FormAddProject
                ref="add"
                errors={{ name: nameErrors }}
                handleClickCancel={this.handleClickCancel.bind(this)}
                handleClickSave={this.handleClickSave.bind(this)} />
        );
    }
};
