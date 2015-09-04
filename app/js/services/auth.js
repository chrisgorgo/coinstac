import axios from 'axios'
import config from 'config';

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
     * @param  {string}  data.label    New user's first name _and_ last name
     * @param  {string}  data.password
     * @return {Promise}               Axios's response
     */
    createUser(data) {
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
