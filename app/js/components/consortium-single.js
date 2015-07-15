'use strict';

import React from 'react';
import consortia from '../services/consortia';

export default class ConsortiumSingle extends React.Component {
    constructor() {
        super();
        this.state = { consortium: null };
    }
    componentDidMount() {
        let label = this.props.params.label;

        consortia.getByLabel(label).then(consortium => {
            this.setState({ consortium });
        }).catch(err => console.error(err));
    }
    render() {
        let consortium = (this.state.consortium || {}).doc || null;

        if (consortium) {
            return (
                <div className="consortium-single">
                    <h1>{consortium.label}</h1>
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
