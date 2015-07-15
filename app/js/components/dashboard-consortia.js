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
                            key={consortium.id}
                            label={consortium.doc.label}
                            users={consortium.doc.users}
                            description={consortium.doc.description}
                            tags={consortium.doc.tags} />
                    );
                })}
            </div>
        )
    }
};
