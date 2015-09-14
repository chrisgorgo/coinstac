import React from 'react';
import run from '../../services/analyze';
import Project from '../../models/project.js';
import dbs from '../../services/db-registry.js';
import filesService from '../../services/files';
import consortia from '../../services/consortia';
import fileService from '../../services/files'; // ToDo -- this reprsents ALL files, not simply those uploaded to this project
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as allActions from '../../actions/index';
import FormManageProject from './form-manage-project'
let requestId = 0;
let actions;
let projectAsyncQueue = Promise.resolve();

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
    }

    componentDidMount() {
        this.saveFile = this.saveFile.bind(this); // prebind for easy listener removal
        filesService.addChangeListener(this.saveFile);
    }

    componentWillMount() {
        // fetch current project, all consortia, then patch state
        let projectRefreshed = dbs.get('projects').get(this.props.projectId)
        .then((p) => {
            this.project = window.project = new Project(p);
            /** UPDATE STATE ON MODEL CHANGES  **/
            this.project.on('all', () => actions.setProject(this.project.serialize())); // @note: [1]
            this.project.trigger('change');
        })
        .catch(err => console.error(err));

        let consortiaRefreshed = consortia.all()
        .then(consortia => actions.setConsortia(consortia))
        .catch(err => console.error(err));

        Promise.all([projectRefreshed, consortiaRefreshed])
        .then((r) => this.setConsortiumContext(this.project.defaultConsortiumId))
        .then((r) => this.indexConsortiumAnalysesBySha());
    }

    componentWillUnmount() {
        files.removeChangeListener(this.saveFile);
        actions.setProject(null); // clear active project, reduce store mem/complexity
    }

    handleConsortiumChange(event) {
        const selectedConsortiumId = event.target.value;
        this.setConsortiumContext(selectedConsortiumId);
        return this.indexConsortiumAnalysesBySha();
    }

    handleFileDelete(file, data, rowIndex, property) {
        // queue all updates to the project to happen one at a time
        projectAsyncQueue = projectAsyncQueue.then(() => {
            this.project.files.remove(file.path); // will ignore duplicates where _id or sha already exist
            return dbs.get('projects').save(this.project.serialize())
            .then(() => dbs.get('projects').get(project._id))
            .then(p => {
                app.notifications.push({message: `File "${file.filename}" removed`, level: 'info'});
                this.project.set(p);
            });
        })
        .catch(err => {
            console.error(err.message);
            throw err;
        });
    }

    handleFileSearch(evt) {
        console.info('@TODO dispatch new action to set project._search');
    }

    handleProjectModelChange(event, component) {
        this.project.set(event.target.name, component.getValue());

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

    indexConsortiumAnalysesBySha() {
        actions.setProjectAnalysesBySha(null);
        return dbs.get('consortium-' + this.props.project.consortium._id).all()
        .then(docs => {
            console.info('@TODO - determine if _doc_ is an analyses result or not');
            actions.setProjectAnalysesBySha(_.indexBy(docs, 'sha'));
        });
    }

    saveFile(meta) {
        // queue all updates to the project to happen one at a time
        projectAsyncQueue = projectAsyncQueue.then(() => {
            const { file, requestId } = meta;
            const oldLen = this.project.files.length;
            this.project.files.add(file, {merge: true}); // will ignore duplicates where _id or sha already exist
            const newLen = this.project.files.length;
            return dbs.get('projects').save(this.project.serialize())
            .then(() => dbs.get('projects').get(project._id))
            .then(p => {
                // the same filepath may now have a different sha, or vice versa, or no change, but regardless
                // is now merged into the file collection set
                if (newLen > oldLen) {
                    app.notifications.push({message: `New file added ${file.filename}`, level: 'success'});
                } else {
                    app.notifications.push({message: `Project files updated`, level: 'info'});
                }
                // only triggers UI update if project Model has actually changed!
                this.project.set(p);
            });
        })
        .catch(err => {
            console.error(err.message);
            throw err;
        });
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
        actions.setProjectConsortiumCtx(consortium || {empty: true});
    }

    setDefaultConsortium() {
        const form = this.refs['form-manage-project'];
        let consortiumId = form.refs.consortium.getValue();
        let consortiumName  = _.result(_.find(this.props.consortia, { '_id': consortiumId }), 'label');
        projectAsyncQueue = projectAsyncQueue.then(() => {
            const prevDefault = this.props.project.defaultConsortiumId;
            let project = this.project.serialize();
            project.defaultConsortiumId = consortiumId;

            dbs.get('projects').save(project)
            .then(p => {
                let updatedMsg = `Default consortium set to ${consortiumName}`;
                if (!consortiumId) {
                    updatedMsg = 'Default consortium cleared';
                }
                this.project.set(p); // update _rev and defaultConsortiumId!
                app.notifications.push({
                    message: updatedMsg,
                    level: 'success'
                });
            });
        })
        .catch(err => {
            console.error(err.message);
            app.notifications.push({
                message: `Unable to set default consortium, ${consortiumName}`,
                level: 'error'
            });
        });
    }

    triggerAddFiles() {
        filesService.getFilesFromUser(++requestId);
    }

    render() {
        if (!this.props.project ||
            !this.props.project._id ||
            !this.props.project.consortium ||
            !this.props.project.consortium.analysesBySha ||
            !Array.isArray(this.props.consortia)) { // empty state === project as {}, so test _id too
            return <span>Loading project...</span>;
        }
        return (
            <FormManageProject
                ref="form-manage-project"
                {...this.props}
                projectModel={this.project}
                handleConsortiumChange={this.handleConsortiumChange.bind(this)}
                handleFileDelete={this.handleFileDelete.bind(this)}
                handleFileSearch={this.handleFileSearch.bind(this)}
                handleProjectModelChange={this.handleProjectModelChange.bind(this)}
                saveFile={this.saveFile.bind(this)}
                saveProject={this.saveProject.bind(this)}
                setDefaultConsortium={this.setDefaultConsortium.bind(this)}
                triggerAddFiles={this.triggerAddFiles.bind(this)}  />
        );
    }
};

// FormManageProjectController.propTypes = {
//     projectId: React.PropTypes.string.isRequired
// };

function select(state) {
    return {
        consortia: state.consortia,
        project: state.project
    };
};
export default connect(select)(FormManageProjectController);
