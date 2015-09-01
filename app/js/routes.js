'use strict';

/**
 * Use React Router to implement application routing.
 *
 * @{@link  http://rackt.github.io/react-router/}
 * @{@link  https://github.com/rackt/react-router}
 */
import React from 'react';
import Router, { Route, DefaultRoute, RouteHandler } from 'react-router';
import Analysis from './components/analysis/index';
import App from './components/app';
import Dashboard from './components/dashboard';
import DashboardHome from './components/dashboard-home';
import DashboardConsortia from './components/dashboard-consortia';
import Home from './components/home';
import LayoutNoAuth from './components/layout-noauth'
import Login from './components/form-login-controller';
import Signup from './components/form-signup-controller';
import ConsortiumSingle from './components/consortium-single';
import Projects from './components/projects';
import ProjectsList from './components/projects-list';
import ProjectsSingle from './components/projects-single';
import FormAddProject from './components/form-add-project';

export default (
    <Route handler={App}>
        <Route name="noauth" path="/" handler={LayoutNoAuth}>
            <DefaultRoute handler={Login} />
            <Route name="login" handler={Login} />
            <Route name="signup" handler={Signup} />
        </Route>
        <Route name="home" path="/home" handler={Home}>
            <Route name="dashboard" path="/home" handler={Dashboard}>
                <DefaultRoute handler={DashboardHome} />
                <Route name="consortia" handler={DashboardConsortia} />
                <Route name="consortium-single" path="/consortia/:label" handler={ConsortiumSingle} />
                <Route name="projects" handler={Projects}>
                    <DefaultRoute name="projects-list" handler={ProjectsList} />
                    <Route
                        name="projects-new"
                        path="/projects/new"
                        handler={FormAddProject} />
                    <Route
                        name="projects-single"
                        path="/projects/:projectId"
                        handler={ProjectsSingle} />
                </Route>
                <Route
                    name="analysis"
                    handler={Analysis}
                    path="/analysis/" />
            </Route>
        </Route>
    </Route>
);
