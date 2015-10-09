import React, { Component, PropTypes } from 'react';
import { Panel, ProgressBar } from 'react-bootstrap';

class ConsortiumSingleResult extends Component {
    constructor(props) {
        super(props);

        this.renderData = this.renderData.bind(this);
        this.renderProgress = this.renderProgress.bind(this);
    }
    renderData() {
        const { data } = this.props;

        if (data) {
            return (
                <ul className="list-unstyled">
                    {Object.keys(data).map((key, i) => {
                        return (
                            <li key={i}>
                                <strong>{key}:</strong>
                                {' '}
                                <code>{data[key]}</code>
                            </li>
                        );
                    })}
                </ul>
            );
        }
    }
    renderProgress() {
        const { error } = this.props;

        if (error) {
            return (
                <div>
                    <ProgressBar bsStyle="danger" label="Error" now={100} />
                    <p className="text-danger">{error}</p>
                </div>
            );
        }

        return (
            <ProgressBar bsStyle="success" label="Complete" now={100} />
        );
    }
    render() {
        const {
            _id: id,
            contributors,
            files,
            sampleSize,
        } = this.props;

        return (
            <Panel key={id}>
                {this.renderProgress()}
                {this.renderData()}
                <ul className="list-unstyled">
                    <li>ID: <code>{id}</code></li>
                    <li>Files: <strong>{files.length}</strong></li>
                    <li>Sample Size: <strong>{sampleSize}</strong></li>
                    <li>Contributors: <strong>{contributors.length}</strong></li>
                </ul>
            </Panel>
        );
    }
};

ConsortiumSingleResult.defaultProps = {
    contributors: [],
    data: {},
    files: [],
    sampleSize: 0,
};

ConsortiumSingleResult.displayName = 'ConsortiumSingleResult';

ConsortiumSingleResult.propTypes = {
    _id: PropTypes.string.isRequired,
    contributors: PropTypes.array.isRequired,
    data: PropTypes.object.isRequired,
    error: PropTypes.any,
    files: PropTypes.array.isRequired,
    sampleSize: PropTypes.number.isRequired,
};

export default ConsortiumSingleResult;
