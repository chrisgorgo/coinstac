'use strict';
import app from 'ampersand-app';
import React from 'react';
import Router, { Route } from 'react-router';
import routes from './routes';
import { Provider } from 'react-redux';
import { compose, createStore, applyMiddleware } from 'redux';
import { devTools, persistState } from 'redux-devtools';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
app.isDev = window.COINS_ENV === 'development';
const finalCreateStore = compose(
    // Enables your middleware:
    applyMiddleware(thunk),
    // Provides support for DevTools:
    devTools(),
    // Lets you write ?debug_session=<name> in address bar to persist debug sessions
    persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/)),
    createStore
);
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
