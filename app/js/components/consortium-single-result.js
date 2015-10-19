import React, { Component, PropTypes } from 'react';
import { Panel, ProgressBar } from 'react-bootstrap';

/**
 * Convert an object to a React `ul`.
 */
function toList(data) {
    return (
        <ul>
            {Object.keys(data).map((key, index) => {
                let value;

                if (Array.isArray(data)) {
                    value = (
                        <span>
                            {data.map(toList)}
                        </span>
                    );
                } else if (data[key] instanceof Object) {
                    value = toList(data[key]);
                } else {
                    value = data[key];
                }

                return (
                    <li key={key}><strong>{key}:</strong>{' '}{value}</li>
                );
            })}
        </ul>
    );
}

class ConsortiumSingleResult extends Component {
    constructor(props) {
        super(props);

        this.renderData = this.renderData.bind(this);
        this.renderProgress = this.renderProgress.bind(this);
    }
    renderData() {
        const { data } = this.props;

        return toList(data);
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
