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
            <div>
                <div className="page-header">
                    <h1>Consortia</h1>
                </div>
                {this.state.consortia.map(function (consortium) {
                    return (
                        <Consortium
                            key={consortium._id}
                            label={consortium.label}
                            users={consortium.users}
                            description={consortium.description}
                            tags={consortium.tags} />
                    );
                })}
            </div>
        )
    }
};
