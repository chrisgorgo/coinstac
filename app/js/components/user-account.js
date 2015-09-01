'use strict';

import React from 'react';
import { ButtonLink } from 'react-router-bootstrap';
import Auth from '../services/auth';
import app from 'ampersand-app';

class UserAccount extends React.Component {

    render() {
        let { user } = this.props.login;
        user = user || {};
        return (
            <div className="user-account">
                <div className="media">
                    <div className="media-left">
                        <img className="media-object img-rounded" src="images/avatar.jpg" alt={name + '\'s avatar'} width="50" height="50" />
                    </div>
                    <div className="media-body">
                        <strong className="block">{user.name}</strong>
                        <br />
                        <em className="h6">{user.email}</em>
                        <br />
                        <ButtonLink bsSize="xsmall" to="login">Log In</ButtonLink>
                    </div>
                </div>
            </div>
        )
    }
}

UserAccount.propTypes = {
    name: React.PropTypes.string.isRequired,
    email: React.PropTypes.string.isRequired
};

export default UserAccount;
