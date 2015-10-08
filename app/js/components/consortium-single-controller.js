import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import partial from 'lodash/function/partial';

import Auth from '../services/auth';
import {
    addAnalysis,
    addResult,
    addUser,
    editResult,
    fetchConsortium,
    fetchResults,
    removeAnalysis,
    removeResult,
    removeUser,
} from '../actions/consortium';
import ConsortiumSingle from './consortium-single';
import {
    getListener as getConsortiumAnalysisResultsListener
} from '../services/consortium-analyses-results';

class ConsortiumSingleController extends Component {
    constructor(props) {
        super(props);
        this.onAnalysisResultsDelete = this.onAnalysisResultsDelete.bind(this);
        this.onAnalysisResultsChange = this.onAnalysisResultsChange.bind(this);
    }

    componentWillMount() {
        const { actions: { fetchConsortium, fetchResults } } = this.props;

        fetchConsortium();
        fetchResults();
    }

    componentDidMount() {
        const { query: { _id: consortiumId } } = this.props;

        getConsortiumAnalysisResultsListener(consortiumId).on(
            'change',
            this.onAnalysisResultsChange
        );
        getConsortiumAnalysisResultsListener(consortiumId).on(
            'delete',
            this.onAnalysisResultsDelete
        );
    }

    componentWillUnmount() {
        const { query: { _id: consortiumId } } = this.props;

        getConsortiumAnalysisResultsListener(consortiumId).removeListener(
            'change',
            this.onAnalysisResultsChange
        );
        getConsortiumAnalysisResultsListener(consortiumId).removeListener(
            'delete',
            this.onAnalysisResultsDelete
        );
    }

    onAnalysisResultsChange(change) {
        const { doc, doc: { _id: resultId } } = change;
        const {
            actions: { addResult, editResult },
            consortium: { ui_results: results },
        } = this.props;

        // If the doc's already in the results it's an edit
        if (results.some(r => r._id === resultId)) {
            editResult(resultId, doc);
        } else {
            addResult(doc);
        }
    }

    onAnalysisResultsDelete(change) {
        const { doc: { _id: resultId } } = change;
        const { removeResult } = this.props.actions;

        removeResult(resultId);
    }

    render() {
        const { consortium, actions } = this.props;

        return (
            <ConsortiumSingle
                actions={actions}
                {...consortium} />
        );
    }
}

ConsortiumSingleController.displayName = 'ConsortiumSingleController';

ConsortiumSingleController.propTypes = {
    actions: PropTypes.objectOf(PropTypes.func).isRequired,
    consortium: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
    const { consortium } = state;
    const { username } = Auth.getUser();

    /** @todo  Use reselect to computed properties for component. */
    return {
        consortium: Object.assign({}, consortium, {
            isMember: consortium.users.some(user => user.username === username),
        }),
    };
}

/**
 * Wire up action creators with the right parameters (usually consortium ID.)
 * This keeps the sub-components simpler.
 */
function mapDispatchToProps(dispatch, ownProps) {
    const { query: { _id } } = ownProps;
    const { username } = Auth.getUser();
    const actions = {
        addAnalysis: partial(addAnalysis, _id),
        addResult: partial(addResult, _id),
        addUser: partial(addUser, _id, username),
        editResult: partial(editResult, _id),
        fetchConsortium: partial(fetchConsortium, _id),
        fetchResults: partial(fetchResults, _id),
        removeAnalysis: partial(removeAnalysis, _id),
        removeResult: partial(removeResult, _id),
        removeUser: partial(removeUser, _id, username),
    };

    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ConsortiumSingleController);
