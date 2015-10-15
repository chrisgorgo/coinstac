/**
 * Use React Router to implement application routing.
 *
 * @{@link  http://rackt.github.io/react-router/}
 * @{@link  https://github.com/rackt/react-router}
 */
import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/app';
import auth from './services/auth';
import Dashboard from './components/dashboard';
import DashboardHome from './components/dashboard-home';
import DashboardConsortia from './components/dashboard-consortia';
import Login from './components/form-login-controller';
import Signup from './components/form-signup-controller';
import ConsortiumSingleController from './components/consortium-single-controller';
import DashboardProjects from './components/projects/dashboard-projects';
import ProjectsList from './components/projects/projects-list';
import PageProject from './components/projects/page-project';
import FormAddProjectController from './components/projects/form-add-project-controller';

/**
 * Force authentication on application routes.
 *
 * @{@link  https://github.com/rackt/react-router/blob/master/docs/API.md#onenternextstate-replacestate}
 * @{@link  https://github.com/rackt/react-router/blob/master/examples/auth-flow/app.js}
 *
 * @todo  Actually validate user by logging them in.
 *
 * @param  {unknown}   nextState
 * @param  {unknown}   replaceState
 * @return {undefined}
 */
function requireAuth(nextState, replaceState) {
    if (!auth.getUser()) {
        replaceState({
            nextPathname: nextState.location.pathname
        }, '/login');
    }
}

export default (
    <Route component={App}>
        <Route path="login" component={Login} />
        <Route path="signup" component={Signup} />
        <Route path="/" component={Dashboard} onEnter={requireAuth}>
            <IndexRoute component={DashboardHome} />
            <Route path="/consortia" component={DashboardConsortia} />
            <Route path="/consortia/:label" component={ConsortiumSingleController} />
            <Route path="/projects" component={DashboardProjects}>
                <IndexRoute component={ProjectsList} />
                <Route
                    path="new"
                    component={FormAddProjectController} />
                <Route
                    path=":projectId"
                    component={PageProject} />
            </Route>
        </Route>
    </Route>
);
