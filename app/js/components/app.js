'use strict';
import app from 'ampersand-app';
import React from 'react';
import { RouteHandler } from 'react-router';
import auth from '../services/auth'
import config from 'config';
import url from 'url';
import thenify from 'thenify'; // jshint ignore:line
import PouchWrapper from 'pouchdb-wrapper';
import Notify from './notification'
// PouchWrapper.PouchDB.debug.enable('pouchdb:http');

window.app = app;

config.api.url = url.format({
    protocol: config.api.protocol,
    hostname: config.api.hostname,
    port: config.api.port
});

config.db.remote.url = url.format({
    protocol: config.db.remote.protocol,
    hostname: config.db.remote.hostname,
    port: config.db.remote.port
});

export default class App extends React.Component {
    render() {
        return (
            <div className="app">
                <Notify />
                <RouteHandler />
            </div>
        );
    }
}
