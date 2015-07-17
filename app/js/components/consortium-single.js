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
import moment from 'moment'; // ToDo moment can be removed, but is here for testing
import run from '../services/analyze.js'

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

        this.db = dbs.register({
            name: this.props.params.label,
            replicate: 'sync'
        });
        this.refreshDbViewMeta();
        this.db.changes.on('change', () => {
            this.refreshDbViewMeta();
        });
    }
    componentDidMount() {
        let label = this.props.params.label;
        consortia.getByLabel(label).then(function(consortium) {
            if (!consortium) {
                throw new ReferenceError('consortium not found');
            }
            this.setState(_.assign(this.state, {consortium: consortium}));
        }.bind(this)).catch(err => console.error(err));
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

    joinConsortium() {
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

    refreshDbViewMeta() {
        return this.db.all({include_docs: true}).then((analysesLight) => { // ToDo, flip to true post debuggins
            this.state = _.assign(this.state, { analysesLight });
            this.setState(this.state);
        });
    }

    showNewAnalysisType() {
        this.state.showAddAnalysis = true;
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
        });
    }

    render() {
        const consortium = this.state.consortium || null;
        const isMember = this.isMember();
        const joinText = isMember ? 'Member' : 'Join Consortium';
        const analysesLight = this.state.analysesLight || [];
        let consortiumAnalysisNames;
        if (!consortium) {
            return <div className="consortium-single consortium-single--no-result"></div>;
        }
        if (consortium && consortium.analysis) {
            consortiumAnalysisNames = consortium.analysis.map(anal => {
                return <li>
                    <span>{anal.name}</span>
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
                <div className="row">
                    <div className="col-xs-12">
                        <h5>Stats</h5>
                        <h6>Analyses Meta</h6>
                        <ul className="list">
                            <li>Record count: {analysesLight.length}</li>
                        </ul>
                        <h6>Analyses Data</h6>
                        <ul className="list">
                            {analysesLight.map(data => {
                                return <li>{JSON.stringify(data, null, 2)}</li>;
                            })}
                        </ul>
                    </div>
                </div>

                <Button onClick={this.testingAddToAnalysis.bind(this)}>Test add to analysis</Button>
            </div>
        );
    }
};
