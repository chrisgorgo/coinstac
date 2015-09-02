import React from 'react';
import run from '../../services/analyze';
import Project from '../../models/project.js';
import dbs from '../../services/db-registry.js';
import consortia from '../../services/consortia';
import fileService from '../../services/files'; // ToDo -- this reprsents ALL files, not simply those uploaded to this project
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as allActions from '../../actions/index';
import FormManageProject from './form-manage-project'

let actions;

class FormManageProjectController extends React.Component {

    constructor(props) {
        super(props);
        actions = actions || bindActionCreators(allActions, props.dispatch);

        // fetch current project, all consortia, then re-render
        let projectStaged = dbs.get('projects').get(props.projectId)
            .then(p => {
                this.project = new Project(p);
                return this.project;
            })
            .then(p => {
                // stage file database for this project
                this.project.db = dbs.get('project-files-' + p._id);
                return this.project.db.all().then(files => {
                    this.project.files.set(files);
                    actions.setProject(this.project.serialize());
                });
            })
            .catch(err => console.error(err));

        let consortiaFetched = consortia.all()
            .then(consortia => { actions.setConsortia(consortia); })
            .catch(err => console.error(err));
    }

    compentWillUnmount() {
        actions.setProject(null); // clear active project
    }

    handleNameChange(event) {
        const { target: { value } } = event;

        let proj = this.props.project;

        // assert that project `name` has content
        if (value) {
            if (proj._errors) {
                delete proj._errors.name;
            }
        }
        proj.name = value;
        debugger;
        return actions.setProject(proj);
    }

    handleConsortiumChange(event) {
        let proj = this.props.project;

        // assert that consortium selected
        if (proj._errors && event.target.value) {
            delete proj._errors.consortium;
        }
        return actions.setProject(proj);
    }

    saveProject(event) {
        event.preventDefault();
        const name = this.refs.name.getValue().trim();
        let proj = this.props.project;

        if (!name) {
            proj._errors.name = 'Name required.';
        } else {
            delete proj._errors.name;
        }

        // Show errors if they exist. Otherwise, submit changes.
        if (Object.keys(proj._errors).length) {
            return actions.setProject(proj);
        }

        // Update project
        project.name = name;

        projects.update(project)
        .then(p => {
            actions.setProject(p);
            app.notification.push({ message: 'Project saved', level: 'success'});
        })
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
        this.project.db.all().then(files => {
            this.project.files.set(files);
            actions.setProject(files);
        });
    }

    setDefaultConsortium() {
        const prevDefault = this.props.project.defaultConsortiumId;
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
        if (!this.project || !this.project.name) { // empty state === project as {}, so test name too
            return <span>Loading project...</span>;
        }
        return (
            <FormManageProject
                {...this.props}
                project={this.project}
                handleNameChange={this.handleNameChange.bind(this)}
                handleConsortiumChange={this.handleConsortiumChange.bind(this)}
                refreshFiles={this.refreshFiles.bind(this)}
                saveProject={this.saveProject.bind(this)}
                setDefaultConsortium={this.setDefaultConsortium.bind(this)} />
        );
    }
};

FormManageProjectController.propTypes = {
    projectId: React.PropTypes.string.isRequired
};

function select(state) { return state; };
export default connect(select)(FormManageProjectController);
