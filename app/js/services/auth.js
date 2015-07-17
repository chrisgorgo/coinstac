'use strict';
import _ from 'lodash';

class Auth {
    constructor(props) {
        props = props || {};
        this.isAuthenticated = props.isAuthenticated || true; // TODO this MUST DEFAULT TO FALSE when we go live
        this.user = {};
    }
    setUser(userMeta) {
        if (!userMeta) {
            return this.clearUser();
        }
        _.assign(this.user, userMeta);
        this.isAuthenticated = true;
        localStorage.setItem('auth', this.toString());
    }
    clearUser() {
        this.user = {};
        this.isAuthenticated = false;
    }
    getUser() {
        let user;
        try {
            return JSON.parse(localStorage.getItem('auth')).user;
        } catch (err) {
            throw new Error('unable to find user information in localStorage');
        }
    }
    toString() {
        let user = _.assign({}, this.user);
        delete user.password;
        return JSON.stringify({
            isAuthenticated: this.isAuthenticated,
            user: user
        });
    }
}

export default new Auth();
