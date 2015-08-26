'use strict';

import React from 'react';
import { Button } from 'react-bootstrap';
import files from '../services/files';
import FileItem from './file-item';

export default class FormAddFile extends React.Component {
    constructor(props) {
        super();
        if (!props.db) {
            throw new ReferenceError('`db` prop required to add files');
        }
        if (!props.onAdd) {
            throw new ReferenceError('`onAdd` prop required to add files');
        }
    }

    componentDidMount() {
        files.addChangeListener(this.props.onAdd);
    }

    componentWillUnmount() {
        files.removeChangeListener(this.props.onAdd);
    }

    addFiles(e) {
        e.preventDefault();
        files.getFilesFromUser(this.props.db);
    }

    render() {
        return (
            <div className="page-header clearfix">
                <Button
                    onClick={this.addFiles.bind(this)}
                    bsStyle="primary"
                    className="pull-right">
                        <strong>+</strong>
                        Add File
                    </Button>
            </div>
        );
    }
};

/*
 * use to show all files in store
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
 */