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
                <div className="page-header">
                    <h1>Files</h1>
                </div>
                <div className="clearfix">
                    <div className="pull-right">
                        <Button
                            bsStyle="primary"
                            onClick={this.addFiles.bind(this)}>Add File</Button>
                    </div>
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
