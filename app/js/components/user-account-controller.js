import { bindActionCreators } from 'redux';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import React from 'react';

import * as allActions from '../actions/index';
import app from 'ampersand-app';
import auth from '../services/auth';
import UserAccount from './user-account';

class UserAccountController extends React.Component {
    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
    }

    logout() {
        console.info(['@TODO `connect` in higher level actions to dispatch',
            '`setUser(null)` action for logout.  Alternatively, consider ',
            'simply transitionTo\'ing with a query for the login handler to',
            'handler, resetting user state'
        ].join(' '));
        app.router.transitionTo('/');
    }

    render() {
        const { dispatch } = this.props;
        const logout = bindActionCreators(this.logout, dispatch);

        return (
            <UserAccount logout={logout} {...this.props} />
        )
    }
}

function select(state) {
    return {
        login: state.login,
        user: auth.getUser(),
    };
}

export default connect(select)(UserAccountController);
