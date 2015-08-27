import React from 'react';
import Router from '../routes';
import run from '../services/analyze';
import { Input, ButtonToolbar, Button } from 'react-bootstrap';
import FormAddFile from './form-add-file.js';
import ProjectFiles from './project-files.js';
import Project from '../models/project.js';
import axios from 'axios';
import dbs from '../services/db-registry.js';
import consortia from '../services/consortia';
import fileService from '../services/files'; // ToDo -- this reprsents ALL files, not simply those uploaded to this project

export default class ProjectsForm extends React.Component {

    static propTypes: {
        projectId: React.PropTypes.string
    }

    assignState(patch, setState) {
        this.state = Object.assign({}, this.state, patch);
        if (setState) {
            this.setState(this.state);
        }
    }

    constructor(props) {
        super(props);
        if (!props.projectId) {
            throw new ReferenceError('projectId required to open projects-form');
        }
        this.state = {
            consortia: [],
            errors: {},
            files: [],
            project: {}
        };

        // fetch current project, all consortia, then re-render
        let projectAndFilesStaged = dbs.get('projects').get(this.props.projectId)
            .then(p => { this.assignState({ project: new Project(p) }); }.bind(this))
            .then(() => {
                // stage file database for this project
                this.filesDb = dbs.get('project-files-' + this.state.project._id);
                return this.filesDb.all().then(files => { this.assignState({ files }); }.bind(this));
            }.bind(this))
            .catch(err => console.error(err));

        let consortiaFetched = consortia.all()
            .then(consortia => { this.assignState({ consortia }); }.bind(this))
            .catch(err => console.error(err));

        Promise.all([projectAndFilesStaged, consortiaFetched]).then(() => {
            this.setState(this.state);
        }.bind(this)).catch(function(err) {
            console.dir(err);
            throw err;
        });
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

        // Update project
        let { project } = this.state;
        project.name = name;
        project.files = files;

        projects.update(project)
        .then(() => { app.notification.push({ message: 'Project saved', level: 'success'}); })
        .catch(err => console.error(err));
    }

    handleSubmitAnalyze() {
        console.log('ToDo'); // TODO
        // const submitToConsortium = consortiaStore.getBy('_id', this.refs.consortium.getInputDOMNode().value);
        // const submitToFileShas = this.refs.files.getSelectedOptions();
        // const files = (this.filesDb().filter((file) => {
        //     return !!_.contains(submitToFileShas, file.sha);
        // });
        // // ToDo setup some async notification of processing
        // run({
        //     files: files,
        //     consortium: submitToConsortium,
        //     db: submitToConsortium.db // ToDo remove db arg from analyze.run. pull db frmo consortium
        // });
    }

    refreshFiles() {
        this.filesDb.all().then(files => {
            this.assignState({ files }, true)
        }.bind(this));
    }

    setDefaultConsortium() {
        const prevDefault = this.state.project.defaultConsortiumId;
        let consortiumId = this.refs.consortium.getValue();
        let consortiumName;
        this.state.project.defaultConsortiumId = consortiumId;
        consortiumName = _.result(_.find(this.state.consortia, { '_id': consortiumId }), 'label');

        dbs.get('projects').save(this.state.project.serialize())
        .then(p => {
            let updatedMsg = `Default consortium set to ${consortiumName}`;
            if (!consortiumId) {
                updatedMsg = 'Default consortium cleared';
            }
            this.state.project.set(p);
            this.setState(this.state);
            app.notifications.push({
                message: updatedMsg,
                level: 'success'
            });
        })
        .catch(err => {
            this.state.project.defaultConsortiumId = prevDefault;
            this.setState(this.state);
            app.notifications.push({
                message: `Unable to set default consortium, ${consortiumName}`,
                level: 'error'
            });
        });
    }

    render() {
        const { consortia, files, project } = this.state;
        const consortium = _.find(consortia, {_id: project.defaultConsortiumId });

        let nameErrors;
        let consortiumErrors;

        if (!project.name) {
            return <span>Loading project...</span>;
        }

        // Is the form for a new project? Change button text
        const buttonText = project.name ? 'Update' : 'Save';

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
                    value={project.name}
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
                        const hasAnalyses = consortium.analyses && consortium.analyses.length;
                        const isSelected = hasAnalyses && project.defaultConsortiumId === consortium._id;
                        return (
                            <option value={consortium._id} selected={isSelected}
                                disabled={!hasAnalyses}
                                title={!hasAnalyses ? 'Please add analyses to consortium' : ''}>
                                {consortium.label + (hasAnalyses ? '' : ' (no analyses available)')}
                            </option>
                        );
                    })}
                </Input>
                <Button onClick={this.setDefaultConsortium.bind(this)} bsSize="xsmall">
                    <span className="glyphicon glyphicon-floppy-save" aria-hidden="true">&nbsp;</span>
                    Set as default consortium
                </Button>

                <FormAddFile onAdd={this.refreshFiles.bind(this)} db={this.filesDb} />
                <ProjectFiles files={files} project={project} consortium={consortium} />)

                <ButtonToolbar className="pull-right">
                    <Button bsStyle="link">
                        <span className="glyphicon glyphicon-remove" aria-hidden="true">&nbsp;</span>
                        Cancel
                    </Button>
                    <Button bsStyle="default" onClick={this.handleSubmitAnalyze.bind(this)} >
                        <span className="glyphicon glyphicon-cloud-upload" aria-hidden="true">&nbsp;</span>
                        Analyze
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
