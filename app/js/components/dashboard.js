'use strict';

import React from 'react';
import { RouteHandler } from 'react-router';
import DashboardNav from './dashboard-nav';
import UserAccount from './user-account'

export default class Dashboard extends React.Component {
    render() {
        return (
            <div className="dashboard container-fluid">
                <div className="row">
                    <div className="col-xs-12 col-sm-4">
                        <nav className="navigation" role="navigation">
                            <h1 className="logo text-center">
                                <abbr title="Collaborative Informatics and Neuroimaging Suite Toolkit for Anonymous Computation">COINSTAC</abbr>
                            </h1>
                            <DashboardNav />
                            <UserAccount {...this.props} />
                        </nav>
                    </div>
                    <div className="col-xs-12 col-sm-8">
                        <RouteHandler />
                    </div>
                </div>
            </div>
        );
    }
};
