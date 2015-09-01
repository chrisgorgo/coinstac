import app from 'ampersand-app';
import auth from '../services/auth';
import config from 'config';
import React from 'react';
import _ from 'lodash';
import FormLogin from './form-login';
import User from '../models/user';
import axios from 'axios';

export default class FormLoginController extends React.Component {
    submit(evt) {
        evt.preventDefault();
        let refs = _.assign(this.refs);
        debugger; // @TODO confirm url and respsonse codes for auth process
        axios({
            url: config.api.url + '/keys-or-something', // @TODO url not confirmed
            method: 'post',
            data: this.refs.logon.data()
        })
        .catch(err => {
            debugger; // @TODO logic path untested. awaiting logon route completion
            // handle 400s vs 500s etc based on expected responses
            app.notifications.push({
                message: 'Invalid username or password.  Please try again',
                level: 'warning'
            });
        })
        .then(r => {
            debugger; // @TODO logic path untested. awaiting logon route completion
            let rawUser = r.data.data[0];
            let user;
            user = new User(rawUser);
            rawUser = user.serialize();
            debugger; // make sure `this` is REALLY `this` because i have trust issues
            auth.setUser(rawUser);
            this.props.setUser(rawUser);
            app.notifications.push({
                message: 'Welcome ' + auth.name,
                level: 'success'
            });
            app.router.transitionTo('/home');
        })
        .catch(err => {
            // @TODO handle error that is unlikely not-network related!
        });
    }

    render() {
        // @TODO remove hot route
        return (
            <FormLogin
                ref="logon"
                hotRoute={() => {
                    // @TODO trash hot-route
                    const user = new User({
                        username: 'admin',
                        name: 'Admin McAdmin',
                        institution: 'BillBraskeyLTD',
                        email: 'heyo'
                    });
                    debugger;
                    auth.setUser(user.serialize());
                    this.props.setUser(user.serialize());
                    app.router.transitionTo('home');
                }.bind(this)}
                submit={this.submit.bind(this)} />
        );
    }
}
