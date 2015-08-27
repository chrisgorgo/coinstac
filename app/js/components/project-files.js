'use strict';
import React from 'react';
import Reactabular from 'reactabular';
// import { Input, ButtonToolbar, Button } from 'react-bootstrap';
// import axios from 'axios';
// import consortia from '../services/consortia';
import dbs from '../services/db-registry.js';
// import fileService from '../services/files'; // ToDo -- this reprsents ALL files, not simply those uploaded to this project
const Search = Reactabular.Search;
const RTable = Reactabular.Table;

export default class ProjectsForm extends React.Component {

    static propTypes: {
        projectId: React.PropTypes.string
    }

    constructor(props) {
        super(props);
        if (!props.project || !props.project.name) {
            throw new ReferenceError('project prop is required to render project files');
        }
        if (!props.files) {
            throw new ReferenceError('files prop is required to render project files');
        }
        this.state = {
            files: this.props.files,

            // Reactabular.Search state
            search: {
                column: '',
                query: ''
            }
        };

        // fetch all project files and update table
        this.filesDb = dbs.get('project-files-' + props.project._id);
        this.refreshFiles();
    }


    componentWillReceiveProps() {
        this.refreshFiles();
    }

    onSearch(search) {
        this.setState({
            search: search
        });
    }

    refreshFiles() {
        this.filesDb.all().then((files) => {
            this.state = Object.assign({}, this.state, { files });
            this.setState(this.state);
        });
    }

    render() {
        const { consortium } = this.props;
        let files = this.state.files;
        if (!files) {
            return <span>Loading files...</span>
        } else if (!files.length) {
            return <span>No project files.  Add some!</span>
        }

        const columns = [
            {
                property: 'filename',
                header: 'File'
            },
            {
                property: 'dirname',
                header: 'Directory'
            }
            // path: ['string', true],
            // dirname: ['string', true],
            // sha: ['string', true]
        ];
        if (consortium && consortium.analyses.length) {
            consortium.analyses.forEach((a) => {
                columns.push({
                    property: '_id',
                    header: a.label
                });
            })
        }

        // apply search reduction
        files = Search.search(
            files,
            columns,
            this.state.search.column,
            this.state.search.query
        );

        return (
            <RTable columns={columns} data={files} />
        );
    }
};
