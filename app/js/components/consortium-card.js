'use strict';

import React from 'react';
import { Link } from 'react-router';
import { ButtonToolbar } from 'react-bootstrap';
import { ButtonLink } from 'react-router-bootstrap';

export default class ConsortiumCard extends React.Component {
    render() {
        return (
            <div className="consortium panel panel-default">

                <div className="panel-heading">

                    <h2 className="panel-title">
                        <Link
                            to="consortium-single"
                            params={{label: this.props.label}}
                            query={{_id: this.props._id}}>
                            {this.props.label}
                        </Link>
                    </h2>
                </div>

                <div className="panel-body">
                    <p>{this.props.description}</p>
                    <ButtonToolbar>
                        <ButtonLink
                            to="consortium-single"
                            params={{label: this.props.label}}
                            query={{_id: this.props._id}}
                            bsSize="small">
                            <span
                                className="glyphicon glyphicon glyphicon-eye-open"
                                aria-hidden="true">
                            </span>
                            View
                        </ButtonLink>
                    </ButtonToolbar>

                    <div className="row">
                        <div className="consortium__tags col-xs-12 col-sm-6">
                            <h5>Tags:</h5>
                            {this.props.tags.map(function (tag) {
                                return <span
                                    key={tag.id}
                                    className="label label-default">
                                    {tag.id}
                                </span>;
                            })}
                        </div>
                        <div className="consortium__users col-xs-12 col-sm-6">
                            <h5>Users:</h5>
                            <ul className="list-inline">
                                {this.props.users.map(function(user, ndx) {
                                    return (
                                        <li
                                            key={user.username + '_' + ndx}>
                                            {user.username}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
};

                        // <span className="btn btn-default btn-sm">
                        //     <span
                        //         className="glyphicon glyphicon-pencil"
                        //         aria-hidden="true">
                        //     </span>
                        //     Edit
                        // </span>