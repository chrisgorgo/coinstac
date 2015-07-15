'use strict';
import React from 'react';
import { RouteHandler } from 'react-router';
import auth from '../services/auth'
import dbs from './app-dbs';

export default class App extends React.Component {
    render() {
        return (
            <div className="app">
                <RouteHandler />
            </div>
        );
    }
}
