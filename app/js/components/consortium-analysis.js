import React, { Component, PropTypes } from 'react';
import { Button, Panel } from 'react-bootstrap';

import regions from '../../common/utils/freesurfer-regions';

class ConsortiumAnalysis extends Component {
    render() {
        const { label, id, region, removeAnalysis } = this.props;

        return (
            <Panel>
                <h2 className="h4">{label}</h2>
                <ul>
                    <li>Region of Interest: <code>{regions[region]}</code></li>
                    <li>ID: <code>{id}</code></li>
                </ul>
                <Button
                    bsStyle="danger"
                    onClick={removeAnalysis.bind(null, id)}>Delete</Button>
            </Panel>
        );
    }
}

ConsortiumAnalysis.displayName = 'ConsortiumAnalysis';

ConsortiumAnalysis.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    region: PropTypes.string.isRequired,
    removeAnalysis: PropTypes.func.isRequired,
};

export default ConsortiumAnalysis;
