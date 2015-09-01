import React from 'react';
import { Button } from 'react-bootstrap';
import Auth from '../services/auth';
import app from 'ampersand-app';

class UserAccount extends React.Component {
    render() {
        let { user } = this.props;
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
                        <Button bsSize="xsmall" to="login">Log Out</Button>
                    </div>
                </div>
            </div>
        )
    }
};

UserAccount.propTypes = {
    user: React.PropTypes.object.isRequired
};

export default UserAccount;
