import React from 'react';
import { Input, ButtonToolbar, Button } from 'react-bootstrap';
import ProjectFiles from './project-files';
import _ from 'lodash';

export default class FormManageProject extends React.Component {
    render() {
        const { consortia, project, projectModel } = this.props;
        const consortium = project && project.consortium;
        return (
            <form onSubmit={this.props.saveProject} className="clearfix">
                <Input
                    ref="name"
                    type="text"
                    label="Name:"
                    name="name"
                    value={this.props.project.name}
                    onChange={(evt) => this.props.handleProjectModelChange(evt, this.refs.name)} />
                <Input
                    ref="consortium"
                    type="select"
                    label="Consortia:"
                    onChange={this.props.handleConsortiumChange} >
                    <option disabled key="0">Choose consortium…</option>
                    {consortia.map(consortium => {
                        const hasAnalyses = consortium.analyses && consortium.analyses.length;
                        const isSelected = project.defaultConsortiumId === consortium._id;
                        const optionText = consortium.label + (hasAnalyses ? '' : ' (no analyses available)');
                        return (
                            <option
                                key={consortium._id}
                                value={consortium._id}
                                disabled={!hasAnalyses}
                                title={!hasAnalyses ? 'Please add analyses to consortium' : ''}
                                selected={isSelected ? 'selected': ''}>
                                {optionText}
                            </option>
                        );
                    })}
                </Input>
                <Button
                    onClick={this.props.setDefaultConsortium}
                    bsSize="xsmall">
                    <span className="glyphicon glyphicon-floppy-save" aria-hidden="true">&nbsp;</span>
                    Set as default consortium
                </Button>

                <div className="page-header clearfix">
                    <Button
                        type="button"
                        onClick={this.props.triggerAddFiles}
                        bsStyle="primary"
                        className="pull-right">
                        <strong>+</strong>
                        Add File
                    </Button>
                </div>

                <ProjectFiles
                    project={projectModel}
                    consortium={consortium}
                    handleFileSearch={this.props.handleFileSearch}
                    handleFileDelete={this.props.handleFileDelete} />

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