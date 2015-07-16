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

const routes = (
    <Route handler={App}>
        <Route name="home" path="/" handler={Home}>
            <Route name="dashboard" path="/" handler={Dashboard}>
                <DefaultRoute handler={DashboardHome} />
                <Route name="consortia" handler={DashboardConsortia} />
                <Route name="consortium-single" path="/consortia/:label" handler={ConsortiumSingle} />
                <Route name="files" handler={DashboardFiles} />
                <Route name="projects" handler={Projects} />
            </Route>
        </Route>
        <Route name="login" handler={Login} />
        <Route name="signup" handler={Signup} />
    </Route>
);

export default Router.create({
    routes: routes,
    location: Router.HashLocation
});
