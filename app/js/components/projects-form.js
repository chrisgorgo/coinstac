'use strict';

import React from 'react';
import { Input, ButtonToolbar, Button } from 'react-bootstrap';
import { files, consortia, myProjects } from '../stores/store';

export default class ProjectsForm extends React.Component {
    static propTypes: {
        projectId: React.PropTypes.string
    }
    constructor(props) {
        super(props);

        let project = _.find(myProjects, project => {
            return project.id === this.props.projectId;
        });

        project = project || {};

        this.state = {
            projectName: (project.name || ''),
            projectConsortia: (project.consortia || []),
            projectFiles: (project.files || [])
        };
    }
    handleNameChange(event) {
        this.setState({ projectName: event.target.value });
    }
    render() {
        const {projectName, projectConsortia, projectFiles} = this.state;

        // Is the form for a new project? Check if there's a `projectName`
        const isNew = projectName ? true : false;

        return (
            <form className="clearfix">
                <Input
                    type="text"
                    label="Name:"
                    value={projectName}
                    onChange={this.handleNameChange.bind(this)} />
                <Input
                    type="select"
                    label="Consortia:">
                    <option selected disabled>Choose…</option>
                    {consortia.map(consortium => {
                        // TODO: Implement multiple consortia select
                        const isSelected = projectConsortia[0] === consortium.id;
                        return (
                            <option value={consortium.id} selected={isSelected}>
                                {consortium.name}
                            </option>
                        );
                    })}
                </Input>
                <Input
                    type="select"
                    label="Files:"
                    help="Choose some files to share."
                    multiple>
                    {files.map(file => {
                        const isSelected = projectFiles.indexOf(file) > -1;
                        return (
                            <option value={file} selected={isSelected}>
                                {file}
                            </option>
                        );
                    })}
                </Input>
                <ButtonToolbar className="pull-right">
                    <Button bsStyle="link">
                        <span className="glyphicon glyphicon-remove" aria-hidden="true">&nbsp;</span>
                        Cancel
                    </Button>
                    <Button bsStyle="primary">
                        <span className="glyphicon glyphicon-ok" aria-hidden="true">&nbsp;</span>
                        {(isNew ? 'Update' : 'Save')}
                    </Button>
                </ButtonToolbar>
            </form>
        );
    }
};
