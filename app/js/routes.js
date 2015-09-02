'use strict';

/**
 * Use React Router to implement application routing.
 *
 * @{@link  http://rackt.github.io/react-router/}
 * @{@link  https://github.com/rackt/react-router}
 */
import React from 'react';
import Router, { Route, DefaultRoute, RouteHandler } from 'react-router';
import App from './components/app';
import Dashboard from './components/dashboard';
import DashboardHome from './components/dashboard-home';
import DashboardConsortia from './components/dashboard-consortia';
import Home from './components/home';
import LayoutNoAuth from './components/layout-noauth'
import Login from './components/form-login-controller';
import Signup from './components/form-signup-controller';
import ConsortiumSingle from './components/consortium-single';
import DashboardProjects from './components/projects/dashboard-projects';
import ProjectsList from './components/projects/projects-list';
import PageProject from './components/projects/page-project';
import FormAddProjectController from './components/projects/form-add-project-controller';

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
                <Route name="projects" handler={DashboardProjects}>
                    <DefaultRoute name="projects-list" handler={ProjectsList} />
                    <Route
                        name="projects-new"
                        path="/projects/new"
                        handler={FormAddProjectController} />
                    <Route
                        name="projects-single"
                        path="/projects/:projectId"
                        handler={PageProject} />
                </Route>
            </Route>
        </Route>
    </Route>
);
