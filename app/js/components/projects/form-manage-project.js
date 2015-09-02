import React from 'react';
import { Input, ButtonToolbar, Button } from 'react-bootstrap';
import FormAddFile from './form-add-file.js';
import ProjectFiles from './project-files'
import _ from 'lodash';

export default class FormManageProject extends React.Component {
    render() {
        const { consortia, project } = this.props;
        const consortium = _.find(consortia, {_id: project.defaultConsortiumId });

        let nameErrors;
        let consortiumErrors;

        // if (Object.keys(this.state.errors).length) {
        //     if (this.state.errors.name) {
        //         nameErrors = {
        //             bsStyle: 'error',
        //             help: this.state.errors.name,
        //             hasFeedback: true
        //         };
        //     }
        //     if (this.state.errors.consortium) {
        //         consortiumErrors = {
        //             bsStyle: 'error',
        //             help: this.state.errors.consortium,
        //             hasFeedback: true
        //         };
        //     }
        // }

        return (
            <form onSubmit={this.props.saveProject} className="clearfix">
                <Input
                    ref="name"
                    type="text"
                    label="Name:"
                    value={project.name}
                    onChange={this.props.handleNameChange}
                    {...nameErrors} />
                <Input
                    ref="consortium"
                    type="select"
                    label="Consortia:"
                    defaultValue={project.defaultConsortiumId}
                    onChange={this.props.handleConsortiumChange}
                    {...consortiumErrors}>
                    <option disabled>Choose…</option>
                    {consortia.map(consortium => {
                        const hasAnalyses = consortium.analyses && consortium.analyses.length;
                        const optionText = consortium.label + (hasAnalyses ? '' : ' (no analyses available)');
                        return (
                            <option
                                key={consortium._id}
                                value={consortium._id}
                                disabled={!hasAnalyses}
                                title={!hasAnalyses ? 'Please add analyses to consortium' : ''}>
                                {optionText}
                            </option>
                        );
                    })}
                </Input>
                <Button onClick={this.props.setDefaultConsortium} bsSize="xsmall">
                    <span className="glyphicon glyphicon-floppy-save" aria-hidden="true">&nbsp;</span>
                    Set as default consortium
                </Button>

                <FormAddFile onAdd={this.props.refreshFiles} db={project.db} />
                <ProjectFiles project={project} consortium={consortium} />

                <ButtonToolbar className="pull-right">
                    <Button bsStyle="link">
                        <span className="glyphicon glyphicon-remove" aria-hidden="true">&nbsp;</span>
                        Cancel
                    </Button>
                    <Button bsStyle="default" onClick={this.props.handleSubmitAnalyze} >
                        <span className="glyphicon glyphicon-cloud-upload" aria-hidden="true">&nbsp;</span>
                        Analyze
                    </Button>
                    <Button
                        type="submit"
                        bsStyle="primary">
                        <span className="glyphicon glyphicon-ok" aria-hidden="true">&nbsp;</span>
                        Save
                    </Button>
                </ButtonToolbar>
            </form>
        );
    }
};
