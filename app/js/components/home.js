'use strict';

import React from 'react';
import { RouteHandler } from 'react-router';

const isAuthenticated = false;

export default class Home extends React.Component {
    static willTransitionTo(transition) {
        if (!isAuthenticated) {
            transition.redirect('login', {}, {'nextPath' : transition.path});
        }
    }
    render() {
        return (
            <div class="home">
                <RouteHandler />
            </div>
        );
    }
};
