import React, { Component, PropTypes } from 'react';
import { Button, Panel } from 'react-bootstrap';

import predictors from '../../common/utils/freesurfer-predictors';

class ConsortiumAnalysis extends Component {
    render() {
        const { label, id, predictor, removeAnalysis } = this.props;

        return (
            <Panel>
                <h2 className="h4">{label}</h2>
                <ul>
                    <li>Predictor: <code>{predictors[predictor]}</code></li>
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
    predictor: PropTypes.string.isRequired,
    removeAnalysis: PropTypes.func.isRequired,
};

export default ConsortiumAnalysis;
