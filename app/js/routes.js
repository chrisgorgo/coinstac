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
import DashboardFiles from './components/dashboard-files';
import Home from './components/home';
import Login from './components/login';
import Signup from './components/signup';
import ConsortiumSingle from './components/consortium-single';
import Projects from './components/projects';
import ProjectsList from './components/projects-list';
import ProjectsSingle from './components/projects-single';
import ProjectsNew from './components/projects-new';

const routes = (
    <Route handler={App}>
        <Route name="login" path="/" handler={Login} />
        <Route name="home" path="/home" handler={Home}>
            <Route name="dashboard" path="/" handler={Dashboard}>
                <DefaultRoute handler={DashboardHome} />
                <Route name="consortia" handler={DashboardConsortia} />
                <Route name="consortium-single" path="/consortia/:label" handler={ConsortiumSingle} />
                <Route name="files" handler={DashboardFiles} />
                <Route name="projects" handler={Projects}>
                    <DefaultRoute name="projects-list" handler={ProjectsList} />
                    <Route
                        name="projects-new"
                        path="/projects/new"
                        handler={ProjectsNew} />
                    <Route
                        name="projects-single"
                        path="/projects/:projectId"
                        handler={ProjectsSingle} />
                </Route>
            </Route>
        </Route>
        <Route name="signup" handler={Signup} />
    </Route>
);

export default Router.create({
    routes: routes,
    location: Router.HashLocation
});
