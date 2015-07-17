'use strict';

import React from 'react';
import { ButtonLink } from 'react-router-bootstrap';
import Auth from '../services/auth';

export default class UserAccount extends React.Component {
    componentWillMount() {
        const user = Auth.getUser();

        if (user) {
            this.setState({
                name: user.name,
                email: user.email
            });
        }
    }
    render() {
        return (
            <div className="user-account">
                <div className="media">
                    <div className="media-left">
                        <img className="media-object img-rounded" src="images/avatar.jpg" alt="Kitty McFeline’s avatar" width="50" height="50" />
                    </div>
                    <div className="media-body">
                        <strong className="block">{this.state.name}</strong>
                        <br />
                        <em className="h6">{this.state.email}</em>
                        <br />
                        <ButtonLink bsSize="xsmall" to="login">Log In</ButtonLink>
                    </div>
                </div>
            </div>
        )
    }
}
