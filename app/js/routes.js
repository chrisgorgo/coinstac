'use strict';

/**
 * Use React Router to implement application routing.
 *
 * @{@link  http://rackt.github.io/react-router/}
 * @{@link  https://github.com/rackt/react-router}
 */
import React from 'react';
import Router, {Route, DefaultRoute, RouteHandler} from 'react-router';
import App from './components/app';
import Form from './components/form';
import Dashboard from './components/dashboard';
import DashboardHome from './components/dashboard-home';
import DashboardConsortia from './components/dashboard-consortia';
import DashboardFiles from './components/dashboard-files';

const routes = (
    <Route handler={App}>
        <Route path="/form" handler={Form} />
        <Route name="dashboard" path="/dashboard" handler={Dashboard}>
            <DefaultRoute handler={DashboardHome} />
            <Route name="consortia" handler={DashboardConsortia} />
            <Route name="files" handler={DashboardFiles} />
        </Route>
    </Route>
);

export default Router.create({
    routes: routes,
    location: Router.HashLocation
});
