'use strict';

import React from 'react';
import { ButtonToolbar, Button, Input } from 'react-bootstrap';

const files = ['my-file-1', 'my-file-2', 'my-file-3', 'my-file-4', 'my-file-5', 'my-file-6'];
const consortia = [{
    id: 'my-sweet-consortia',
    name: 'My Sweet Consortia'
}, {
    id: 'my-ill-thingy',
    name: 'Illest Consort'
}];
const myProjects = [{
    id: 'project-101',
    name: 'My Sweet Project',
    files: ['file-id-1', 'file-id-2', 'file-id-3'],
    consortia: ['my-sweet-consortia']
}, {
    id: 'project-103',
    name: 'My Okay Project',
    files: ['file-id-88', 'file-id-99'],
    consortia: ['my-sweet-consortia']
}];
const analysis = [{
    id: 'analysis-251',
    consortia: 'my-sweet-consortia',
    files: ['file-id-1', 'file-id-2']
}];
class ProjectsForm extends React.Component {
    componentWillMount() {
        if (this.props.projectId) {
            this.setState({ project: myProjects[0] });
        }
    }
    render() {
        const project = this.state.project || {}    ;
        return (
            <form className="clearfix">
                <Input
                    type="text"
                    label="Name:"
                    value={project.name} />
                <Input
                    type="select"
                    label="Consortia:">
                    <option selected disabled>Choose…</option>
                    {consortia.map(consortium => {
                        const selected = consortium.id === project.consortia[0];
                        return (
                            <option value="{consortium.id}" selected={selected}>
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
                        return <option>{file}</option>;
                    })}
                </Input>
                <ButtonToolbar className="pull-right">
                    <Button bsStyle="link">
                        <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                        &nbsp;
                        Cancel
                    </Button>
                    <Button bsStyle="primary">
                        <span className="glyphicon glyphicon-ok" aria-hidden="true"></span>
                        &nbsp;
                        Save
                    </Button>
                </ButtonToolbar>
            </form>
        );
    }
};

export default class Projects extends React.Component {
    render() {
        return (
            <div className="projects">
                <div className="page-header clearfix">
                    <h1 className="pull-left">Projects</h1>
                    <Button bsStyle="primary">Add Project</Button>
                </div>
                {myProjects.map(project => {
                    return (
                        <div className="project">
                            <h4>{project.name}</h4>
                            <p>ID: {project.id}</p>
                        </div>
                    );
                })}
                <ProjectsForm  />
            </div>
        );
    }
}
