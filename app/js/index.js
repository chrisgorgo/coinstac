'use strict';
import app from 'ampersand-app';
import React from 'react';
import Router, { Route } from 'react-router';
import routes from './routes';
import { Provider } from 'react-redux';
import { compose, createStore, applyMiddleware } from 'redux';
import { devTools, persistState } from 'redux-devtools';
import * as coinstacMiddleware from './services/redux-middleware'
import thunk from 'redux-thunk';
import rootReducer from './reducers';
app.isDev = window.COINS_ENV === 'development';

// configure redux middleware
let middleware = [thunk];
// middleware.push(coinstacMiddleware.logger);
middleware.push(coinstacMiddleware.authentication);

let storeComponents = [applyMiddleware.apply(this, middleware)];
if (app.isDev) {
    storeComponents.push(devTools());
    // Lets you write ?debug_session=<name> in address bar to persist debug sessions
    storeComponents.push(persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/)));
}
storeComponents.push(createStore);
const finalCreateStore = compose.apply(this, storeComponents);
app.store = finalCreateStore(rootReducer);

// Load application stylesheets
require('../styles/app.scss');
require('reactabular/style.css')

app.router = Router.create({
    routes: routes,
    location: Router.HashLocation
});

app.router.run((Handler, routerState) => { // note "routerState" here
    React.render(
        <Provider store={app.store}>
            {() => <Handler routerState={routerState} />}
        </Provider>,
        document.getElementById('app')
    );
});

window.app = app;
