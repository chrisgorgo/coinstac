import path from 'path';
require('../common/utils/promise-uncaught-polyfill.js')({ root: window });
import app from 'ampersand-app';
import React from 'react';
import Router, { Route } from 'react-router';
import { Provider } from 'react-redux';

import configureStore from './store/configureStore';
import routes from './routes';

app.coinstacDir = window.coinstacDir;
app.isDev = window.COINS_ENV === 'development';
app.store = configureStore();

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

window.onerror = function(err) {
    console.error('unhandled error');
    if (err && err.message) {
        console.error(err.message);
    }
    console.dir(err);
}
console.info('>> renderer process up');
