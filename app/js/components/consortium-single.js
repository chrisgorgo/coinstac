'use strict';

import React from 'react';
import consortia from '../services/consortia';
import FormAddAnalysis from './form-add-analysis';
import {Button} from 'react-bootstrap';
import auth from '../services/auth';
import dbs from './app-dbs';
import _ from 'lodash';
import xhr from 'xhr';
import config from 'config';

export default class ConsortiumSingle extends React.Component {
    constructor() {
        super();
        this.state = {
            consortium: null,
            showAddAnalysis: false,
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
                replicate: 'sync'
            });
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
            this.state.consortium._rev = body.rev;
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

    showNewAnalysisType() {
        this.state.showAddAnalysis = true;
        this.setState(this.state);
    }

    cancelNewAnalysisType() {
        this.state.showAddAnalysis = false;
        this.setState(this.state);
    }

    submitAnalysisType(newAnalysis, cb) {
        this.state.consortium.analysis = this.state.consortium.analysis || [];
        this.state.consortium.analysis.push(newAnalysis);
        xhr({
            url: config.api.url + '/consortia',
            method: 'put',
            json: this.state.consortium
        }, function(err, response, body) {
            if (err) {
                throw new Error(err);  // ToDo - post user friendly error instead
                this.state.consortium.analysis = _.remove(this.state.consortium.analysis, (a) => {
                    return a.name === newAnalysis.name;
                });
            } else {
                this.state.consortium._rev = body.rev;
                this.cancelNewAnalysisType(); // ~reset and close add form
            }
            cb(err, body);
            this.setState(this.state);
        }.bind(this));
    }

    render() {
        const consortium = this.state.consortium || null;
        const isMember = this.isMember();
        const joinText = isMember ? 'Member' : 'Join Consortium';
        let consortiumAnalysisNames;
        if (!consortium) {
            return <div className="consortium-single consortium-single--no-result"></div>;
        }
        if (consortium && consortium.analysis) {
            consortiumAnalysisNames = consortium.analysis.map(anal => {
                return <li>{anal.name} <a bsStyle="error" className="pull-right">Delete</a></li>;
            });
        }
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
                    <div className="col-xs-12">
                        <h5>Analysis Types</h5>
                        <Button
                            onClick={this.showNewAnalysisType.bind(this)}
                            bsStyle="primary"
                            bsSize="xsmall"
                            className="clearfix pull-right"
                            type="button">New Analysis Type</Button>
                        <div className={this.state.showAddAnalysis ? null : 'hidden'}>
                            <hr/>
                            <FormAddAnalysis
                                onSubmit={this.submitAnalysisType.bind(this)}
                                onCancel={this.cancelNewAnalysisType.bind(this)}
                                consortium={consortium} />
                            <hr/>
                        </div>
                    </div>
                    <div className="col-xs-12">
                        <ul className="list">
                            {consortiumAnalysisNames}
                        </ul>
                    </div>
                </div>
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
    }
};
