'use strict';

import React from 'react';
import consortia from '../services/consortia';
import {Button} from 'react-bootstrap';
import xhr from 'xhr';
import _ from 'lodash';
import auth from '../services/auth';
import dbs from './app-dbs';
let config = window.config;

export default class ConsortiumSingle extends React.Component {
    constructor() {
        super();
        this.state = {
            consortium: null,
            isMember: null
        };
    }
    componentDidMount() {
        let label = this.props.params.label;

        consortia.getByLabel(label).then(function(consortium) {
            if (!consortium) {
                throw new ReferenceError('consortium not found');
            }
            this.db = dbs.register({
                name: this.props.params.label,
                conn: {
                    protocol: config.db.remote.protocol,
                    hostname: config.db.remote.hostname,
                    port: config.db.remote.port,
                    pathname: this.props.params.label
                },
                pouchOptions: {},
                replicate: [
                    {
                        dir: 'in'
                    }, {
                        dir: 'out'
                    }
                ]
            });

            // TODO remove live reporting
            window.log = function() {console.dir(arguments);};
            this.db.db.changes({
                since: 'now',
                live: true,
                include_docs: true // jshint ignore:line
            }).on('change', window.log);
            // end live reporting

            this.setState(_.assign(this.state, {consortium: consortium}));
        }.bind(this)).catch(err => console.error(err));
    }
    handleClickJoinConsortium() {
        let user = auth.getUser();
        this.state.consortium.users.push(auth.getUser());
        xhr({
            url: config.api.url + '/consortia',
            method: 'put',
            json: this.state.consortium
        }, function(err, response, body) {
            if (err) {
                throw new Error(err);
                this.state.consortium.users = _.remove(this.state.consortium.users, (u) => {
                    return u.id === user.id;
                });
            }
            this.setState(this.state);
        }.bind(this));
    }
    isMember() {
        let consortium = this.state.consortium;
        let user = auth.getUser();
        let userIds;
        if (consortium) {
            userIds = consortium.users.map(user => { return user.id; });
            if (_.contains(userIds, user.id)) {
                return true;
            }
        }
        return false;
    }
    render() {
        let consortium = this.state.consortium || null;
        let isMember = this.isMember();
        let joinText = isMember ? 'Member' : 'Join Consortium';
        if (consortium) {
            return (
                <div className="consortium-single">
                    <h1>{consortium.label}</h1>
                    <Button
                        onClick={this.handleClickJoinConsortium.bind(this)}
                        bsStyle="success"
                        className="clearfix pull-right"
                        type="button"
                        disabled={isMember}
                        block>{joinText}</Button>
                    <p className="lead">{consortium.description}</p>
                    <div className="row">
                        <div className="col-xs-12 col-sm-6">
                            <h5>Tags:</h5>
                            {consortium.tags.map(tag => {
                                return (
                                    <span className="label label-default">
                                        {tag}
                                    </span>
                                );
                            })}
                        </div>
                        <div className="col-xs-12 col-sm-6">
                            <h5>Users:</h5>
                            <ul className="list-inline">
                                {consortium.users.map(user => {
                                    return <li>{user}</li>;
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
            );
        } else {
            return <div className="consortium-single consortium-single--no-result"></div>;
        }
    }
};
