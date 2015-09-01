import moment from 'moment';
import { ProgressBar } from 'react-bootstrap';
import React, { Component, PropTypes } from 'react';

function getTimeSince(time) {
    return moment(time).fromNow(true) + ' elapsed';
}

const STATUSES = {
    ERROR: 'ERROR',
    SUCCESS: 'SUCCESS',
    WARNING: 'WARNING',
};

class AnalysisProgress extends Component {
    render() {
        const { progress, startTime, status } = this.props;
        let time = getTimeSince(startTime);
        let style;

        switch(status) {
            case STATUSES.ERROR:
                style = 'danger';
                break;
            case STATUSES.WARNING:
                style = 'warning';
                break;
            default:
                style = 'success';
                break;
        }

        return(
            <div className="analysis-progress">
                <ProgressBar bsStyle={style} now={progress} />
                <span className="analysis-progress-time">{time}</span>
            </div>
        );
    }
};

AnalysisProgress.displayName = 'AnalysisProgress';

AnalysisProgress.PropTypes = {
    progress: PropTypes.number.isRequired,
    startTime: PropTypes.number.isRequired,
    status: PropTypes.oneOf(Object.keys(STATUSES)),
};

export { STATUSES };

export default AnalysisProgress;
