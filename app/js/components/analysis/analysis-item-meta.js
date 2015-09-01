import React, { Component, PropTypes } from 'react';

class AnalysisItemMeta extends Component {
    render() {
        const { consortium, project } = this.props;
        return (
            <dl className="analysis-item-meta">
                <dt>Project:</dt>
                <dd>{project.name}</dd>
                <dt>Consortium</dt>
                <dd>{consortium.name}</dd>
            </dl>
        );
    }
};

AnalysisItemMeta.displayName = 'AnalysisItemMeta';

AnalysisItemMeta.propTypes =  {
    consortium: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
};

export default AnalysisItemMeta;
