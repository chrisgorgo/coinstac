'use strict';
import _ from 'lodash';

class Auth {

    setUser(user) {
        delete user.password;
        localStorage.setItem('auth', JSON.stringify({user}));
    }

    getUser() {
        const auth = JSON.parse(localStorage.getItem('auth'));
        if (auth) {
            if (!('user' in auth)) {
                throw new ReferenceError('Unable to find saved user.');
            }
        }
        if (!auth) {
            return;
        }

        return auth.user;
    }

}

export default new Auth();
