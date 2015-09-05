import app from 'ampersand-app';
import React from 'react';
import { Button } from 'react-bootstrap';
import Auth from '../services/auth';
import UserAccount from './user-account';

class UserAccountController extends React.Component {
    logout() {
        console.info(['@TODO `connect` in higher level actions to dispatch',
            '`setUser(null)` action for logout.  Alternatively, consider ',
            'simply transitionTo\'ing with a query for the login handler to',
            'handler, resetting user state'
        ].join(' '));
        app.router.transitionTo('/');
    }

    render() {
        let { user } = this.props.login;
        user = user || {};
        return (
            <UserAccount logout={this.logout.bind(this)} user={user} />
        )
    }
}

export default UserAccountController;
