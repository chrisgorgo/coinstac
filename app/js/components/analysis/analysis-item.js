import classnames from 'classnames';
import { Button } from 'react-bootstrap';
import React, { Component, PropTypes } from 'react';

import AnalysisItemFile from './analysis-item-file';
import AnalysisItemMeta from './analysis-item-meta';
import AnalysisProgress from './analysis-progress';

class AnalysisItem extends Component {
    constructor() {
        super();

        this.state = {
            expanded: false,
        };
    }
    toggleExpanded() {
        this.setState({
            expanded: !this.state.expanded,
        });
    }
    render() {
        const { analysis, complete, files, progress } = this.props;
        const { expanded } = this.state;
        const classNames = classnames('analysis-item', {
            'is-complete': complete,
            'is-expanded': expanded,
        });
        let button;

        if (complete) {
            button = <Button bsStyle="primary">Results</Button>;
        } else {
            button = <Button bsStyle="danger">Stop</Button>;
        }

        return (
            <div className={classNames}>
                <div className="analysis-item-header">
                    <a onClick={this.toggleExpanded.bind(this)}>
                        <h2>{analysis.name}</h2>
                    </a>
                    <a href="#">Info</a>
                    <AnalysisProgress {...progress} />
                    {button}
                </div>
                <div className="analysis-item-content">
                    <AnalysisItemMeta {...analysis} />
                    <ul className="analysis-item-files">
                        {files.map(file => <AnalysisItemFile {...file} />)}
                    </ul>
                </div>
            </div>
        );
    }
};

AnalysisItem.propTypes = {
    complete: PropTypes.bool.isRequired,
    files: PropTypes.array,
    progress: PropTypes.object.isRequired,
};

export default AnalysisItem;
