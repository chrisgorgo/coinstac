import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

import AnalysisItem from './analysis-item';
import { STATUSES as PROGRESS_STATUSES } from './analysis-progress';
import { STATUSES as FILE_STATUSES } from './analysis-item-file';

function getMockProgress() {
    return {
        progress: _.random(0, 100),
        startTime: (new Date(2015, 7, _.random(1, 30))).getTime(),
        status: _.sample(PROGRESS_STATUSES),
    };
}
function getMockAnalysis(name) {
    return {
        analysis: {
            consortium: {
                id: _.uniqueId(),
                name: 'Sample Consortium #' + _.random(0, 100),
            },
            id: _.uniqueId(),
            name,
            project: {
                id: _.uniqueId(),
                name: 'Project Test #' + _.random(0, 100),
            },
        },
        complete: _.sample([true, false]),
        files: _.map(Array(_.random(2, 5)), () => {
            return {
                id: _.uniqueId(),
                name: `Temp File ${_.random(1000, 9999)}.txt`,
                progress: getMockProgress(),
                status: _.sample(FILE_STATUSES),
            };
        }),
        progress: getMockProgress(),
    };
}

const analyses = _.map(Array(5), (item, index) => {
    return getMockAnalysis(`Sweet Analysis #${index}`);
});

class Analysis extends Component {
    render() {
        // { analysis } = this.props;
        return (
            <div className="analysis">
                {analyses.map(analysis => <AnalysisItem {...analysis} />)}
            </div>
        );
    }
};

Analysis.displayName = 'Analysis';

// Analysis.propTypes = {
//     analyses: PropTypes.array,
// };

export default Analysis;
