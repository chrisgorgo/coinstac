'use strict';
import Auth from '../services/auth';
import React, { Component, PropTypes } from 'react';
import DashboardNav from './dashboard-nav';
import UserAccountController from './user-account-controller';
import consortiaService from '../services/consortia';
import contains from 'lodash/collection/contains';
import { connect } from 'react-redux';
import { getListener } from '../services/consortium-analyses-results';
import * as actions from '../actions';
const { initBackgroundServicesStart, initBackgroundServicesFinish } = actions;

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.initBackgroundServices = this.initBackgroundServices.bind(this);
        this.props.initBackgroundServicesStart();
        consortiaService.all()
            .then(this.initBackgroundServices)
            .then(this.props.initBackgroundServicesFinish);
    }

    initBackgroundServices(consortia) {
        return consortia.forEach(consortium => {
            if (contains(consortium.users), this.props.username) {
                // instantiate consortium analysis services in background
                // e.g. auto-updating, recomputing, etc.
                getListener(consortium._id);
            }
        });
    }

    render() {
        const { children, history: { pushState}, ui_backgroundServicesLoading } = this.props;
        if (ui_backgroundServicesLoading) {
            return (
                <div className="dashboard container-fluid">
                    <p>Add fancy UI disabled and loading funness here</p>
                </div>
            );
        }
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

function mapStateToProps(state) {
    const { username } = Auth.getUser();
    const { ui_backgroundServicesLoading } = state;
    return {
        ui_backgroundServicesLoading,
        username
    };
}

export default connect(
    mapStateToProps,
    { initBackgroundServicesStart, initBackgroundServicesFinish }
)(Dashboard);
