import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import partial from 'lodash/function/partial';

import Auth from '../services/auth';
import {
    fetchConsortium,
    addUser,
    removeUser,
    addAnalysis,
    removeAnalysis,
} from '../actions/consortium';
import ConsortiumSingle from './consortium-single';
import dbs from '../services/db-registry';

class ConsortiumSingleController extends Component {
    constructor(props) {
        super(props);
        // this.onAnalysisChange = this.onAnalysisChange.bind(this);
    }
    componentWillMount() {
        const {
            actions: { fetchConsortium },
            query: { _id },
        } = this.props;

        fetchConsortium();

        // dbs.get('consortium-' + _id).on('change', this.onAnalysisChange);
    }
    componentWillUnmount() {
        // dbs.get('consortium-' + _id).off('change', this.onAnalysisChange);
    }
    // onAnalysisChange(changeEvent) {
    //     debugger;
    // }
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
        fetchConsortium: partial(fetchConsortium, _id),
        addUser: partial(addUser, _id, username),
        removeUser: partial(removeUser, _id, username),
        addAnalysis: partial(addAnalysis, _id),
        removeAnalysis: partial(removeAnalysis, _id),
    };

    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ConsortiumSingleController);
