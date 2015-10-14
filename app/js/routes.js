'use strict';

/**
 * Use React Router to implement application routing.
 *
 * @{@link  http://rackt.github.io/react-router/}
 * @{@link  https://github.com/rackt/react-router}
 */
import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/app';
import Dashboard from './components/dashboard';
import DashboardHome from './components/dashboard-home';
import DashboardConsortia from './components/dashboard-consortia';
import Home from './components/home';
import LayoutNoAuth from './components/layout-noauth'
import Login from './components/form-login-controller';
import Signup from './components/form-signup-controller';
import ConsortiumSingleController from './components/consortium-single-controller';
import DashboardProjects from './components/projects/dashboard-projects';
import ProjectsList from './components/projects/projects-list';
import PageProject from './components/projects/page-project';
import FormAddProjectController from './components/projects/form-add-project-controller';

export default (
    <Route handler={App}>
        <Route path="/" handler={LayoutNoAuth}>
            <IndexRoute handler={Login} />
            <Route path="login" handler={Login} />
            <Route path="signup" handler={Signup} />
        </Route>
        <Route path="/home" handler={Home}>
            <Route path="/home" handler={Dashboard}>
                <IndexRoute handler={DashboardHome} />
                <Route path="consortia" handler={DashboardConsortia} />
                <Route path="/consortia/:label" handler={ConsortiumSingleController} />
                <Route path="projects" handler={DashboardProjects}>
                    <IndexRoute handler={ProjectsList} />
                    <Route
                        path="/projects/new"
                        handler={FormAddProjectController} />
                    <Route
                        path="/projects/:projectId"
                        handler={PageProject} />
                </Route>
            </Route>
        </Route>
    </Route>
);
