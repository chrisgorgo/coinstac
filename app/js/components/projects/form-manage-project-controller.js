import _ from 'lodash';
import app from 'ampersand-app';
import sha1 from 'sha-1';
import Errio from 'errio';
import React from 'react';
import Project from '../../models/project.js';
import dbs from '../../services/db-registry.js';
import consortia from '../../services/consortia.js';
import fileService from '../../services/files.js';
import analyzeService from '../../services/analyze.js';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as allActions from '../../actions/index';
import FormManageProject from './form-manage-project';
import fieldStateToBsClass from '../../utils/field-state-to-bs-class';
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
        this.handleAnalyzed = this.handleAnalyzed.bind(this);
        fileService.addChangeListener(this.saveFile);
        analyzeService.addChangeListener(this.handleAnalyzed);
    }

    componentWillMount() {
        app.analysisRequestId = app.analysisRequestId || 0;

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
        .catch(err => {
            app.notifications.push({
                message: 'Failed to download consortia',
                level: 'error'
            })
            console.error(err);
            throw err;
        });

        Promise.all([projectRefreshed, consortiaRefreshed])
        .then(r => {
            this.setConsortiumContext(this.project.defaultConsortiumId);
            if (this.project.defaultConsortiumId) {
                this.setAnalysisCtx(this.project.defaultAnalysisId);
            }
        })
        .catch(err => {
            app.notifications.push({
                message: 'Failed to load project',
                level: 'error'
            })
            console.error(err);
        });
    }

    componentWillUnmount() {
        analyzeService.removeChangeListener(this.handleAnalyzed);
        fileService.removeChangeListener(this.saveFile);
        this.props.dispatch(allActions.setProject(null));
    }

    handleAnalyzed(result) {
        let { error, data } = result;
        if (error) {
            error = Errio.parse(error);
            let msg = error.message;
            if (error.data && error.data.file) {
                msg = msg + ` (file: ${error.data.file.filename})`;
            }
            return app.notifications.push({
                message: `Failed to analyze files: ${msg}`,
                level: 'error'
            });
        }
        const fileShas = result.fileShas;
        const cDb = dbs.get(this.props.project.consortium.dbUrl);
        result._id = sha1(fileShas.sort().join(''));
        return cDb.all().then(docs => {
            // @TODO test if docs submitted are a subset of existing analysis
            // @TODO test if docs submitted are a superset of existing analysis
            // @TODO test if focs are sameset/diffset
        }).then(() => {
            return cDb.save(result).then(d => {
                return app.notifications.push({
                    message: `Analysis request ${result.requestId} complete!`,
                    level: 'success'
                });
            });
        }).catch(err => {
            let msg = 'Unable to store completed analysis';
            if (err.status === 409) {
                msg = 'Analysis over this fileset already submitted';
            }
            return app.notifications.push({
                message: msg,
                level: 'error'
            });
        });

    }

    handleAnalysisCtxChange(evt) {
        this.setAnalysisCtx(evt.target.value);
    }

    handleConsortiumCtxChange(evt) {
        return this.setConsortiumContext(evt.target.value);
    }

    /**
     * Toggle the 'control' flag tag on a file object.
     *
     * @param  {number}  fileIndex
     * @param  {boolean} isControl
     * @return {Promise}
     */
    handleFileControlChange(fileIndex, isControl) {
        const controlTagValue = !!isControl;
        const projectId = this.project._id;
        const projectsDb = dbs.get('projects');

        function errorHandler(error) {
            app.notifications.push({
                level: 'error',
                message: `Couldn’t change control tag on file #${fileIndex + 1}`,
            });
            console.error(error);
        }

        return projectsDb.get(projectId)
            .then(project => {
                const file = project.files[fileIndex];
                file.tags.control = controlTagValue;
                return projectsDb.save(project)
                    .then(() => {
                        actions.changeFileControlTag(
                            projectId,
                            file.sha,
                            controlTagValue
                        );
                    }, errorHandler);
            }, errorHandler);
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
        const prop = event.target.name;
        const value = component.getValue();
        if (prop === 'name') {
            actions.setProject({
                ui_fieldNameState: value ? 'valid' : 'invalid'
            });
        }
        this.project.set(prop, value);
    }

    handleSubmitAnalyze() {
        const submitToConsortium = _.find(
            this.props.consortia,
            {_id: this.props.project.consortium._id}
        );
        const files = this.props.project.files;
        analyzeService.analyze({
            requestId: ++app.analysisRequestId,
            predictors: ['Left-Hippocampus'], // @TODO make part of analysis definition
            files
        });
        app.notifications.push({
            message: `Analysis request ${app.analysisRequestId} dispatched!`,
            level: 'info'
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
            throw new TypeError('project attempted to save without a name');
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

    setAnalysisCtx(analysisId, consortium) {
        return actions.setProjectConsortiumAnalysisCtx(analysisId);
    }

    setConsortiumContext(consortiumId) {
        const consortium = _.find(this.props.consortia, {_id: consortiumId });
        return actions.setProjectConsortiumCtx(consortium);
    }

    setDefaultAnalysis() {
        const form = this.refs['form-manage-project'];
        let analysisId = form.refs.analysis.getValue();
        let analysisName  = _.result(_.find(this.props.project.consortium.analyses, { 'id': analysisId }), 'label');
        projectAsyncQueue = projectAsyncQueue.then(() => {
            const prevDefault = this.props.project.defaultAnalysisId;
            let project = this.project.serialize();
            project.defaultAnalysisId = analysisId;
            dbs.get('projects').save(project)
            .then(p => {
                let updatedMsg = `Default analysis set to ${analysisName}`;
                if (!analysisId) {
                    updatedMsg = 'Default analysis cleared';
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
                message: `Unable to set default analysis, ${analysisName}`,
                level: 'error'
            });
        });
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
        fileService.getFilesFromUser(++requestId);
    }

    render() {
        if (!this.props.project ||
            !this.props.project._id ||
            !Array.isArray(this.props.consortia)) { // empty state === project as {}, so test _id too
            return <span>Loading project...</span>;
        }
        return (
            <FormManageProject
                ref="form-manage-project"
                {...this.props}
                projectModel={this.project}
                handleConsortiumCtxChange={this.handleConsortiumCtxChange.bind(this)}
                handleAnalysisCtxChange={this.handleAnalysisCtxChange.bind(this)}
                handleFileControlChange={this.handleFileControlChange.bind(this)}
                handleFileDelete={this.handleFileDelete.bind(this)}
                handleFileSearch={this.handleFileSearch.bind(this)}
                handleSubmitAnalyze={this.handleSubmitAnalyze.bind(this)}
                handleProjectModelChange={this.handleProjectModelChange.bind(this)}
                saveFile={this.saveFile.bind(this)}
                saveProject={this.saveProject.bind(this)}
                setDefaultConsortium={this.setDefaultConsortium.bind(this)}
                setDefaultAnalysis={this.setDefaultAnalysis.bind(this)}
                triggerAddFiles={this.triggerAddFiles.bind(this)}
                fieldNameClass={fieldStateToBsClass(this.props.project.ui_fieldNameState)} />
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
