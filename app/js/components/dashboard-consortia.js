'use strict';

import React from 'react';
import Consortium from './consortium';
import consortia from '../services/consortia';

export default class DashboardConsortia extends React.Component {
    constructor() {
        super();
        this.state = { consortia: [] };
    }
    componentDidMount() {
        consortia.getAll()
            .then(consortia => this.setState({ consortia }))
            .catch(err => console.error(err));
    }
    render() {
        return (
            <div className="dashboard-consortia">
                <div className="page-header">
                    <h1>Consortia</h1>
                </div>
                <div className="row">
                    {this.state.consortia.map(function (consortium) {
                        return (
                            <div className="col-xs-12 col-sm-6">
                                <Consortium
                                    _id={consortium._id}
                                    label={consortium.label}
                                    users={consortium.users}
                                    description={consortium.description}
                                    tags={consortium.tags} />
                            </div>
                        );
                    })}
                </div>
            </div>
        )
    }
};
