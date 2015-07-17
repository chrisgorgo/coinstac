'use strict';

import React from 'react';
import consortia from '../services/consortia';
import FormAddAnalysis from './form-add-analysis';
import {Button} from 'react-bootstrap';
import auth from '../services/auth';
import _ from 'lodash';
import xhr from 'xhr';
import config from 'config';
import moment from 'moment'; // ToDo moment can be removed, but is here for testing
import run from '../services/analyze'

export default class ConsortiumSingle extends React.Component {
    constructor() {
        super();
        this.state = {
            analysesLight: [],
            consortium: null,
            showAddAnalysis: false,
            isMember: null
        };
    }

    cancelNewAnalysisType() {
        this.state.showAddAnalysis = false;
        this.setState(this.state);
    }

    componentWillMount() {
        consortia.getBy('_id', this.props.query._id).then((consortium) => {
            if (!consortium) {
                throw new ReferenceError(`consortium ${this.props.query._id} not found in registry`);
            }
            this.state.consortium = consortium;
            this.db = this.state.consortium.db; // ToDo this should be params.id eventually
            if (!this.db) {
                throw new ReferenceError(`db ${this.state.consortium.label} not in registry`);
            }
            this.setState(this.state);
            this.refreshDbViewMeta();
            this.db.on('change', (evt) => { this.refreshDbViewMeta(); });
        }.bind(this));
    }

    componentWillUnmount() {
        if (this.db) {
            this.db.off('change', (evt) => {this.refreshDbViewMeta(); });
        }
    }

    isMember(consortium) {
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

    joinConsortium() {
        let user = auth.getUser();
        this.state.consortium.users.push(auth.getUser());
        let tConsortium = _.clone(this.state.consortium);
        delete tConsortium.db; // ToDo replace consortium with Model, serialize
        xhr({
            url: config.api.url + '/consortia',
            method: 'put',
            json: tConsortium
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

    refreshDbViewMeta() {
        return this.db.all()
            .then((analysesLight) => {
                this.state = _.assign(this.state, { analysesLight });
                this.setState(this.state);
            }.bind(this));
    }

    showNewAnalysisType() {
        this.state.showAddAnalysis = true;
        this.setState(this.state);
    }

    submitAnalysisType(newAnalysis, cb) {
        let tConsortium;
        this.state.consortium.analyses = this.state.consortium.analyses || [];
        tConsortium = _.clone(this.state.consortium);
        delete tConsortium.db; // ToDo make consortium a REST API Model w/ ampersand model, and use .serialize() here
        this.state.consortium.analyses.push(newAnalysis);
        xhr({
            url: config.api.url + '/consortia',
            method: 'put',
            json: tConsortium
        }, function(err, response, body) {
            if (err) {
                throw new Error(err);  // ToDo - post user friendly error instead
                this.state.consortium.analyses = _.remove(this.state.consortium.analyses, (a) => {
                    return a.label === newAnalysis.label;
                });
            } else {
                this.state.consortium._rev = body.rev;
                this.cancelNewAnalysisType(); // ~reset and close add form
            }
            cb(err, body);
            this.setState(this.state);
        }.bind(this));
    }

    /**
     * TODO remove function, add to projects pane
     * @return {[type]} [description]
     */
    testingAddToAnalysis() {
        run({
            files: [
                {
                    // _id: 'file_process_test_' + (moment().format()),
                    sha: 'asdfasdw'
                },
                {
                    // _id: 'file_process_test_' + (moment().format()),
                    sha: 'asdfasdw'
                }
            ],
            consortium: this.state.consortium,
            db: this.db
        }).then(() => {
            return this.refreshDbViewMeta();
        }.bind(this));
    }

    render() {
        const consortium = this.state.consortium || null;
        const isMember = this.isMember(consortium);
        const joinText = isMember ? 'Member' : 'Join Consortium';
        const analysesLight = this.state.analysesLight || [];
        let consortiumAnalysisNames;
        if (!consortium) {
            return <div className="consortium-single consortium-single--no-result"></div>;
        }
        if (consortium && consortium.analyses) {
            consortiumAnalysisNames = consortium.analyses.map(anal => {
                return <li>
                    <span>{anal.label}</span>
                    <a bsStyle="error" className="pull-right">Delete</a>
                    <span className="pull-right"    style={{marginRight: '4px', fontFamily: 'monospace'}}>
                        <small><small>(id: {anal.id})</small></small>
                    </span>
                </li>;
            });
        }
        return (
            <div className="consortium-single">
                <h1>{consortium.label}</h1>
                <Button
                    onClick={this.joinConsortium.bind(this)}
                    bsStyle="success"
                    className="clearfix pull-right"
                    type="button"
                    disabled={isMember}
                    block>{joinText}</Button>
                <p className="lead">{consortium.description}</p>
                <div className="row">
                    <div className="col-xs-12">
                        <h5 title="These analyses are run on all raw data added to the project">Analyses</h5>
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
                <div className="row">
                    <div className="col-xs-12">
                        <h5>Stats</h5>
                        <h6>Analyses Meta</h6>
                        <ul className="list">
                            <li>Record count: {analysesLight.length}</li>
                        </ul>
                        <h6>Analyses Data</h6>
                        <Button onClick={this.testingAddToAnalysis.bind(this)}>Test add to analysis</Button>
                        <ul className="list">
                            {analysesLight.map(data => {
                                return <li>{JSON.stringify(data, null, 2)}</li>;
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
};
