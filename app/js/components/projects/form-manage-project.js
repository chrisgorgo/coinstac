import React from 'react';
import { Input, ButtonToolbar, Button } from 'react-bootstrap';
import ProjectFiles from './project-files';
import _ from 'lodash';

export default class FormManageProject extends React.Component {
    render() {
        const { consortia, project, projectModel } = this.props;
        const consortium = project && project.consortium;
        const selectedAnalysis = consortium && consortium.ui_selectedAnalysis;
        let analysisInput;
        let addFilesButton;

        const formBase = (
            <div>
                <Input
                    ref="name"
                    type="text"
                    label="Name:"
                    name="name"
                    value={this.props.project.name}
                    onChange={evt => this.props.handleProjectModelChange(evt, this.refs.name)} />

                <Button className="pull-right"
                    onClick={this.props.setDefaultConsortium}
                    bsSize="xsmall">
                    <span className="glyphicon glyphicon-floppy-save" aria-hidden="true">&nbsp;</span>
                    Set as default consortium
                </Button>
                <Input
                    ref="consortium"
                    type="select"
                    label="Consortia:"
                    onChange={this.props.handleConsortiumCtxChange} >
                    <option key="0" value=''>Choose consortium…</option>
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
            </div>
        );

        return (
            <form onSubmit={this.props.saveProject} className="clearfix">
                {formBase}
                {analysisInput}

                {consortium ?
                    (<div>
                        <Button className="pull-right"
                            onClick={this.props.setDefaultAnalysis}
                            bsSize="xsmall">
                            <span className="glyphicon glyphicon-floppy-save" aria-hidden="true">&nbsp;</span>
                            Set as default analysis
                        </Button>
                        <Input
                            ref="analysis"
                            type="select"
                            label="Analysis:"
                            onChange={this.props.handleAnalysisCtxChange} >
                            <option key="0" value="">Choose analysis…</option>
                            {consortium.analyses.map(analysis => {
                                const isSelected = consortium.ui_selectedAnalysis === analysis.id;
                                return (
                                    <option
                                        key={analysis.id}
                                        value={analysis.id}
                                        selected={isSelected}>
                                        {analysis.label}
                                    </option>
                                );
                            })}
                        </Input>
                    </div>) : ''
                }

                {selectedAnalysis ?
                    (
                        <div className="page-header clearfix">
                            <Button
                                type="button"
                                onClick={this.props.triggerAddFiles}
                                bsStyle="primary"
                                className="pull-right"
                                disabled={!consortium}>
                                <strong>+</strong>
                                Add File
                            </Button>
                        </div>
                    ) : ''
                }

                {selectedAnalysis ?
                    (
                        <ProjectFiles
                            project={projectModel}
                            consortium={consortium}
                            handleFileSearch={this.props.handleFileSearch}
                            handleFileDelete={this.props.handleFileDelete} />
                    ) : <span>Please select a consortium & analysis</span>
                }

                <ButtonToolbar className="pull-right">
                    <Button
                        id="cancel"
                        bsStyle="link">
                        <span className="glyphicon glyphicon-remove" aria-hidden="true">&nbsp;</span>
                        Cancel
                    </Button>
                    <Button
                        id="analyze"
                        bsStyle="default"
                        disabled={!selectedAnalysis}
                        onClick={this.props.handleSubmitAnalyze} >
                        <span className="glyphicon glyphicon-cloud-upload" aria-hidden="true">&nbsp;</span>
                        Analyze
                    </Button>
                    <Button
                        id="save"
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
