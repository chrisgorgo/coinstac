'use strict';
import React from 'react';
import { RouteHandler } from 'react-router';
import auth from '../services/auth'
import config from 'config';
import url from 'url';
import thenify from 'thenify'; // jshint ignore:line
import PouchDB from 'pouchdb';
PouchDB.debug.enable('pouchdb:http');
var request = require('browser-request'); // non es6 s.t. import is mutable
request = thenify(request);

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
                <RouteHandler />
            </div>
        );
    }
}
