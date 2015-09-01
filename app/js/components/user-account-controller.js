import React from 'react';
import { Button } from 'react-bootstrap';
import Auth from '../services/auth';
import app from 'ampersand-app';
import UserAccount from './user-account';

class UserAccountController extends React.Component {

    render() {
        let { user } = this.props.login;
        user = user || {};
        return (
            <UserAccount user={user} />
        )
    }
}

export default UserAccountController;
