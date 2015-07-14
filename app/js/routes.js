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

const routes = (
    <Route handler={App}>
        <DefaultRoute name="home" path="/" handler={Home}>
            <DefaultRoute name="dashboard" path="/dashboard" handler={Dashboard}>
                <DefaultRoute handler={DashboardHome} />
                <Route name="consortia" handler={DashboardConsortia} />
                <Route name="files" handler={DashboardFiles} />
            </DefaultRoute>
        </DefaultRoute>
        <Route name="login" handler={Login} />
        <Route name="signup" handler={Signup} />
    </Route>
);

export default Router.create({
    routes: routes,
    location: Router.HashLocation
});
