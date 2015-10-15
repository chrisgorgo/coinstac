import app from 'ampersand-app';
import config from 'config';
import Notify from './notification'
import React, { Component, PropTypes } from 'react';
import thenify from 'thenify'; // jshint ignore:line
import url from 'url';

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

export default class App extends Component {
    render() {
        return (
            <div className="app">
                <Notify />
                {this.props.children}
            </div>
        );
    }
}

App.displayName = 'App';

App.propTypes = {
    children: PropTypes.node,
};
