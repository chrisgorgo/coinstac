'use strict';

import React from 'react';

export default class UserAccount extends React.Component {
    render() {
        return (
            <div className="user-account">
                <div className="media">
                    <div className="media-left">
                        <img className="media-object img-rounded" src="images/avatar.jpg" alt="Kitty McFeline’s avatar" width="50" height="50" />
                    </div>
                    <div className="media-body">
                        <strong className="block">Dr. Kitty McFeline</strong>
                        <br />
                        <em className="h6">Institution Name</em>
                    </div>
                </div>
            </div>
        )
    }
}
