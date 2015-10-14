'use strict';

import React, { Component, PropTypes } from 'react';
import DashboardNav from './dashboard-nav';
import UserAccountController from './user-account-controller'

class Dashboard extends Component {
    render() {
        const { children, history: { pushState} } = this.props;

        return (
            <div className="dashboard container-fluid">
                <div className="row">
                    <div className="col-xs-12 col-sm-4">
                        <nav className="navigation" role="navigation">
                            <h1 className="logo text-center">
                                <abbr title="Collaborative Informatics and Neuroimaging Suite Toolkit for Anonymous Computation">COINSTAC</abbr>
                            </h1>
                            <DashboardNav />
                            <UserAccountController pushState={pushState} />
                        </nav>
                    </div>
                    <div className="col-xs-12 col-sm-8">
                        {children}
                    </div>
                </div>
            </div>
        );
    }
};

Dashboard.displayName = 'Dashboard';

Dashboard.propTypes = {
    children: PropTypes.node.isRequired,
    history: PropTypes.object.isRequired,
};

export default Dashboard;
