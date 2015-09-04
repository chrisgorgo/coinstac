import _ from 'lodash';
import url from 'url';

import axios from 'axios'
import config from 'config';

function getApiUrl(endpoint) {
    return url.format(config.api) + endpoint;
}

class Auth {
    /**
     * Create a new user.
     *
     * Makes a request to the API to create a new user. Response should contain
     * new user info.
     *
     * @param  {Object}  data          Information to create a new user
     * @param  {string}  data.username
     * @param  {string}  data.email
     * @param  {string}  data.name     New user's first name and last name
     * @param  {string}  data.password
     * @return {Promise}               Axios's response
     */
    createUser({ email, name, password, username }) {
        // The API requires a `label` key instead of `name`
        const data = {
            email,
            label: name,
            password,
            username,
        };

        return axios({
            method: 'post',
            url: config.api.url + '/users',
            data,
        });
    }

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
