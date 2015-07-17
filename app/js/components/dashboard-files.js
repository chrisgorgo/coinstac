'use strict';

import React from 'react';
import { Button } from 'react-bootstrap';
import files from '../services/files';
import FileItem from './file-item';

function getFilesState() {
    return { files: files.getSavedFiles() };
}

export default class DashboardFiles extends React.Component {
    constructor() {
        super();
        this.state = getFilesState();
    }
    componentDidMount() {
        files.addChangeListener(this._onChange.bind(this));
    }
    componentWillUnmount() {
        files.removeChangeListener(this._onChange.bind(this));
    }
    _onChange() {
        this.setState(getFilesState());
    }
    addFiles(e) {
        e.preventDefault();
        files.getFilesFromUser();
    }
    render() {
        return (
            <div className="dashboard-files">
                <div className="page-header clearfix">
                    <h1 className="pull-left">Files</h1>
                    <Button
                        onClick={this.addFiles.bind(this)}
                        bsStyle="primary"
                        className="pull-right">
                            <strong>+</strong>
                            Add File
                        </Button>
                </div>
                {this.state.files.map(file => {
                    return (
                        <FileItem
                            filename={file.filename}
                            path={file.path}
                            dirname={file.dirname}
                            sha={file.sha}
                            size={file.size}
                            modified={file.modified} />
                    );
                })}
            </div>
        );
    }
};
