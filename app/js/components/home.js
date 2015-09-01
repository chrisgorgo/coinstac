import React from 'react';
import { RouteHandler } from 'react-router';
import { bindActionCreators } from 'redux';
import * as allActions from '../actions/index';
import { connect } from 'react-redux';

let cachedActions;
class Home extends React.Component {
    constructor(props) {
        super(props);
        this.actions = null;
    }
    componentWillMount() {
        cachedActions = cachedActions || bindActionCreators(allActions, this.props.dispatch);
        cachedActions.init(); // trigger middlware state-change assertions, e.g. user authorized
    }
    render() {
        return (
            <div className="home">
                <RouteHandler {...cachedActions} {...this.props} />
            </div>
        );
    }
};

function select(state) { return state; };
export default connect(select)(Home);
