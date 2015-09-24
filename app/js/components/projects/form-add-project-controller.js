import app from 'ampersand-app';
import Project from '../../models/project.js'
import React from 'react';
import FormAddProject from './form-add-project';
import Guid from 'guid';
import dbs from '../../services/db-registry';
export default class FormAddProjectController extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            errors: {}
        };
    }

    handleClickCancel() {
        app.router.transitionTo('projects');
    }

    handleClickSave(evt) {
        evt.preventDefault();
        const data = this.refs.add.data();
        const name = data.name;
        const { errors } = this.state;

        if (!name) {
            errors.name = 'Name required';
        } else {
            delete errors.name;
        }

        // Show errors if they exist. Otherwise, submit changes.
        if (Object.keys(errors).length) {
            return this.setState({ errors });
        }

        let project = new Project({ _id: Guid.create().value, name });
        return dbs.get('projects').add(project.serialize())
        .then(() => {
            app.notifications.push({
                message: `Project '${name}' created`,
                level: 'success'
            });
            app.router.transitionTo('projects');
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
