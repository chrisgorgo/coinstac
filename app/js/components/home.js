import React from 'react';
import { RouteHandler } from 'react-router';
import { bindActionCreators } from 'redux';
import * as allActions from '../actions/index';
import { connect } from 'react-redux';

let cachedActions;

let init = false;
class Home extends React.Component {
    render() {
        const actions = cachedActions || bindActionCreators(allActions, this.props.dispatch);
        if (!init) {
            actions.init(); // trigger middlware state-change assertions, e.g. user authorized
            init = true;
        }
        return (
            <div className="home">
                <RouteHandler {...actions} {...this.props} />
            </div>
        );
    }
};

function select(state) { return state; };
export default connect(select)(Home);
