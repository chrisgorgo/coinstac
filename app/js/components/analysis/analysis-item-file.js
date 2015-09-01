import classnames from 'classnames';
import { Link } from 'react-router';
import React, { Component, PropTypes } from 'react';

import AnalysisProgress from './analysis-progress';

const STATUSES = {
    COMPLETE: 'COMPLETE',
    ERROR: 'ERROR',
};

class AnalysisItemFile extends Component {
    render() {
        const { name, progress, status } = this.props;
        const classNames = classnames('analysis-item-file', {
            'is-complete': status === STATUSES.COMPLETE,
            'is-error': status === STATUSES.ERROR
        });

        return (
            <div className={classNames}>
                <a>{name}</a>
                <AnalysisProgress {...progress} />
            </div>
        );
    }
};

AnalysisItemFile.displayName = 'AnalysisItemFile';

AnalysisItemFile.propTypes = {
    file: PropTypes.object.isRequired,
    progress: PropTypes.object.isRequired,
    status: PropTypes.oneOf(Object.keys(STATUSES)),
};

export { STATUSES };

export default AnalysisItemFile;
