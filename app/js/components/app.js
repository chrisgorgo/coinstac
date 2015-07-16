'use strict';
import React from 'react';
import { RouteHandler } from 'react-router';
import auth from '../services/auth'
import dbs from './app-dbs';
import config from 'config';
import url from 'url';
import thenify from 'thenify'; // jshint ignore:line
var request = require('browser-request'); // non es6 s.t. import is mutable
request = thenify(request);

import anal from '../services/analyze.js';

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
