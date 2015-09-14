import React from 'react';
import Reactabular from 'reactabular';
import dbs from '../../services/db-registry.js';
const Search = Reactabular.Search;
const RTable = Reactabular.Table;
const sortColumn = Reactabular.sortColumn;

export default class ProjectFiles extends React.Component {

    static propTypes: {
        projectId: React.PropTypes.string
    }

    constructor(props) {
        super(props);
        if (!props.project || !props.project._id) {
            throw new ReferenceError('project prop is required to render project files');
        }
        if (!props.project.files) {
            throw new ReferenceError('project.files attr is required to render project files');
        }
    }

    render() {
        let { project, consortium, _search } = this.props;
        let files = project.files;
        _search = _search || {};

        if (!files) {
            return <span>Loading files...</span>
        } else if (!files.length) {
            return <span>No project files.  Add some!</span>
        }

        let columns = [
            {
                property: 'filename',
                header: 'File'
            },
            {
                property: 'dirname',
                header: 'Directory'
            },
        ];

        if (this.props.consortium && this.props.consortium.analysesBySha) {
            columns.push({
                header: 'Stage For Analysis',
                cell: (value, data, rowIndex, property) => {
                    value = data[rowIndex];
                    return {
                        value: this.props.consortium.analysesBySha[value.sha] ?
                            <span className="glyphicon glyphicon-ok" aria-hidden="true"></span> :
                            <input ref={value.sha} title={value.sha} type="checkbox"></input>
                    }
                }
            });
        }

        columns.push({
            header: 'Delete',
            cell: (value, data, rowIndex, property) => {
                value = data[rowIndex];
                return {
                    value: <span>
                        <span onClick={() => this.props.handleFileDelete(value, data, rowIndex, property)} style={{cursor: 'pointer', padding: '10px'}}>&#10007;</span>
                    </span>
                };
            },
        });

        // apply search reduction
        files = Search.search(
            files,
            columns,
            _search.column,
            _search.query
        );

        return (
            <div>
                <div className='well search-container'>
                    Search:
                    <Search
                        columns={columns}
                        data={files.models}
                        onChange={this.props.handleFileSearch}>
                    </Search>
                </div>
                <RTable
                    className="table"
                    columns={columns}
                    data={files.models} />
            </div>
        );
    }
};