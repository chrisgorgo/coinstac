'use strict';

import React from 'react';
import { Link } from 'react-router';

export default class Consortium extends React.Component {
    render() {
        return (
            <div className="consortium">
                <h2>
                    <Link to="consortium-single" params={{label: this.props.label}}>
                        {this.props.label}
                    </Link>
                </h2>
                <p>{this.props.description}</p>
                <div className="row">
                    <div className="consortium__tags col-xs-12 col-sm-6">
                        <h5>Tags:</h5>
                        {this.props.tags.map(function (tag) {
                            return <span className="label label-default">{tag.id}</span>;
                        })}
                    </div>
                    <div className="consortium__users col-xs-12 col-sm-6">
                        <h5>Users:</h5>
                        <ul className="list-inline">
                            {this.props.users.map(function (user) {
                                return <li>{user.id}</li>;
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
};
