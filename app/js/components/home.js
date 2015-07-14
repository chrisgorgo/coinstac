'use strict';

import React from 'react';
import { RouteHandler } from 'react-router';
import auth from '../services/auth';

export default class Home extends React.Component {
    static willTransitionTo(transition) {
        if (!auth.isAuthenticated) {
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
