'use strict';

import React from 'react';
import { ButtonToolbar, Button } from 'react-bootstrap';
import prettysize from 'prettysize';
import moment from 'moment';
import files from '../services/files';

const changeListeners = [];

// TODO: Roll these into view helpers
function getFileName(path) {
    return path.split('/').pop();
}
function getFileSize(bytes) {
    return prettysize(bytes);
}
function getTime(timestamp) {
    return moment(timestamp).fromNow();
}

export default class FileItem extends React.Component {
    removeFile() {
        files.removeFileByPath(this.props.filename);
    }
    editFile() {
        console.log('Implement file editing...', this.props);
    }
    render() {
        return (
            <div className="file-item">
                <div className="clearfix">
                    <h3 className="file-item__name pull-left">{getFileName(this.props.filename)}</h3>
                    <ButtonToolbar className="pull-right">
                        <Button onClick={this.removeFile.bind(this)} bsStyle="danger">
                            <span className="glyphicon glyphicon-trash"></span>
                            {" Remove"}
                        </Button>
                    </ButtonToolbar>
                </div>
                <ul className="list-unstyled text-muted">
                    <li>Full Path: <strong>{this.props.filename}</strong></li>
                    <li>Size: <strong>{getFileSize(this.props.size)}</strong></li>
                    <li>Modified: <strong>{getTime(this.props.modified)}</strong></li>
                </ul>
            </div>
        );
    }
};
