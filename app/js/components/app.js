'use strict';
import app from 'ampersand-app';
import React from 'react';
import { RouteHandler } from 'react-router';
import auth from '../services/auth'
import config from 'config';
import url from 'url';
import thenify from 'thenify'; // jshint ignore:line
import Pouchy from 'pouchy';
import Notify from './notification'
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
// Pouchy.PouchDB.debug.enable('pouchdb:http');

config.api.url = url.format({
    protocol: config.api.protocol,
    hostname: config.api.hostname,
    port: config.api.port,
    pathname: config.api.pathname
});

config.db.remote.url = url.format({
    protocol: config.db.remote.protocol,
    hostname: config.db.remote.hostname,
    port: config.db.remote.port
});

export default class App extends React.Component {
    render() {
        let devPanel;
        // if (app.isDev) {
        //     devPanel = (
        //         <DebugPanel top right bottom>
        //             <DevTools store={app.store} monitor={LogMonitor} />
        //         </DebugPanel>
        //     );
        // }
        return (
            <div className="app">
                <Notify />
                {this.props.children}
                {devPanel}
            </div>
        );
    }
}
