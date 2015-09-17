import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';

import * as ConsortiumActions from '../actions/consortium';
import ConsortiumSingle from './consortium-single';

class ConsortiumSingleController extends Component {
    componentDidMount() {
        const { dispatch, query: { _id } } = this.props;
        dispatch(ConsortiumActions.fetchConsortium(_id));
    }
    render() {
        const { consortium, dispatch } = this.props;
        const actions = bindActionCreators(ConsortiumActions, dispatch);
        return <ConsortiumSingle actions={actions} {...consortium} />
    }
}

ConsortiumSingleController.displayName = 'ConsortiumSingleController';

ConsortiumSingleController.propTypes = {
    consortium: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
    return {
        consortium: state.consortium,
    };
}

export default connect(mapStateToProps)(ConsortiumSingleController);
