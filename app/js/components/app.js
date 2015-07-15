'use strict';

import React from 'react';
import { RouteHandler } from 'react-router';
import xhr from 'xhr';

export default class App extends React.Component {
    render() {
        return (
            <div className="app">
                <RouteHandler />
            </div>
        );
    }
}
