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

/**
 * @class FormManageProjectContoller
 * Defines controlling logic for managing of a project
 * @note a key element to this form is the `project` Model.  When the project changes,
 * the redux state is change as well.  This is because we bind model changes to the
 * redux action definitions, which triggers a full state re-render.
 */
class FormManageProjectController extends React.Component {

    constructor(props) {
        super(props);
        actions = bindActionCreators(allActions, props.dispatch);
        this.assestsReady = null;
    }

    componentWillMount() {
        // fetch current project, all consortia, then re-render
        let projectRefreshed = dbs.get('projects').get(this.props.projectId)
        .then(p => {
            this.project = window.project = new Project(p);
            /** UPDATE STATE ON MODEL CHANGES  **/
            this.setConsortiumContext(this.project.defaultConsortiumId);
            this.project.on('all', () => actions.setProject(this.project.serialize()));
            return this.project;
        })
        .then(p => {
            // stage file database for this project
            return this.project.db.all().then(files => {
                this.project.files.set(files);  // collections don't auto-trigger ... (see continuation)
            });
        })
        .catch(err => console.error(err));

        let consortiaRefreshed = consortia.all()
        .then(consortia => { actions.setConsortia(consortia); })
        .catch(err => console.error(err));

        Promise.all([projectRefreshed, consortiaRefreshed])
        .then(r => {
            this.assestsReady = true;
            this.project.trigger('change'); // ... (resume) model updates, so update state!
        });
    }

    compentWillUnmount() {
        actions.setProject(null); // clear active project
    }

    handleConsortiumChange(event) {
        const selectedConsortiumId = event.target.value;
        return this.setConsortiumContext(selectedConsortiumId);
    }

    handleProjectModelChange(event, component) {
        this.project.set(event.target.name, component.getValue());

    }

    saveProject(event) {
        event.preventDefault();

        if (!this.project.name) {
            this.project.set('_errorName', 'Name required', {silent: true});;
        } else {
            this.project.set('_errorName', null, {silent: true});;
        }

        // Show errors if they exist. Otherwise, submit changes.
        if (this.project._errorName) {
            return this.project.trigger('change'); // sets project state!
        }

        dbs.get('projects').update(this.project.serialize())
        .then(p => {
            app.notifications.push({ message: 'Project saved', level: 'success'});
            this.project.set(p); // update with latest settings from db, e.g. rev
        })
        .catch(err => {
            app.notifications.push({ message: 'Project failed to save :/', level: 'error'});
            console.error(err);
        });
    }

    setConsortiumContext(consortiumId) {
        const consortium = _.find(this.props.consortia, {_id: consortiumId });
        actions.setProjectConsortiumCtx(consortium || {});
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

    saveFile(meta) {
        const {file, requestId} = meta;
        const oldLen = this.project.files.length;
        this.project.files.add(file, {merge: true}); // will ignore duplicates where _id or sha already exist
        const newLen = this.project.files.length;
        dbs.get('projects').save(this.project.serialize())
        .then(p => {
            if (newLen > oldLen) {
                app.notifications.push({message: `New file added ${file.filename}`, level: 'success'});
            } else {
                // the same filepath may now have a different sha, or vice versa, or no change, but regardless
                // is now merged into the file collection set
                app.notifications.push({message: `Project files updated`, level: 'info'});
            }
            this.project.set(p);
        }); // only triggers UI update if project Model has actually changed!
    }

    setDefaultConsortium() {
        const prevDefault = this.props.project.defaultConsortiumId;
        const form = this.refs['form-manage-project'];
        let consortiumId = form.refs.consortium.getValue();
        this.project.defaultConsortiumId = consortiumId;

        dbs.get('projects').save(this.project.serialize())
        .then(p => {
            let consortiumName  = _.result(_.find(this.state.consortia, { '_id': consortiumId }), 'label');
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
        if (!this.assestsReady || !this.props.project || !this.props.project._id) { // empty state === project as {}, so test _id too
            return <span>Loading project...</span>;
        }
        return (
            <FormManageProject
                ref="form-manage-project"
                {...this.props}
                projectModel={this.project}
                handleConsortiumChange={this.handleConsortiumChange.bind(this)}
                handleProjectModelChange={this.handleProjectModelChange.bind(this)}
                saveFile={this.saveFile.bind(this)}
                saveProject={this.saveProject.bind(this)}
                setDefaultConsortium={this.setDefaultConsortium.bind(this)} />
        );
    }
};

// FormManageProjectController.propTypes = {
//     projectId: React.PropTypes.string.isRequired
// };

function select(state) { return state; };
export default connect(select)(FormManageProjectController);
