import _ from 'lodash';
import url from 'url';

import axios from 'axios'
import config from 'config';
import User from '../models/user';

const STORAGE_KEY = 'COINSTAC_AUTH_USER';

/** Hold a private reference to the user model */
let user;

function getApiUrl(endpoint) {
    return url.format(config.api) + endpoint;
}

const Auth = {
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
    createUser: function({ email, name, password, username }) {
        // The API requires a `label` key instead of `name`
        const data = {
            email,
            label: name,
            password,
            username,
        };

        return axios({
            method: 'post',
            url: getApiUrl('/users'),
            data,
        })
            .then(Auth.login({ password, username }));
    },

    /**
     * Log in.
     *
     * @param  {Object}  data          User login credentials
     * @param  {string}  data.password
     * @param  {string}  data.username
     * @return {Promise}               Axios's response
     */
    login: function({ password, username }) {
        const data = {
            password: btoa(password),
            username: btoa(username),
        };

        return axios({
            method: 'post',
            url: getApiUrl('/auth/keys'),
            data,
        })
            .then(response => {
                debugger;
                return response.data.data[0]
            })
            .then(Auth.setAuthResponse)
            .then(Auth.setUser);
    },

    /**
     * Log out.
     *
     * @return {Promise} Axios's response
     */
    logout: function() {
        const { user = { id } } = Auth.getAuthResponse();
        axiox({
            method: 'delete',
            url: getApiUrl(`/auth/keys/${id}`),
        })
            .then(response => {
                Auth.clearAuthResponse();
                Auth.clearUser();
                return response;
            });
    },

    /**
     * Save user.
     *
     * @param  {Object} userAttributes
     * @return {Object}
     */
    setUser: function(userAttributes) {
        user = new User(userAttributes);
        return Auth.getUser();
    },

    /**
     * Get saved user.
     *
     * @return {Object}
     */
    getUser: function() {
        if (user) {
            return {
                email: user.get('email'),
                institution: user.get('institution'),
                name: user.get('name'),
                username: user.get('username'),
            };
        }
    },

    clearUser: function() {
        if (user) {
            user.clear();
        }
    },

    setAuthResponse: function(auth) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
        return Auth.getAuthResponse();
    },

    getAuthResponse: function() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY));
    },

    clearAuthResponse: function() {
        localStorage.removeItem(STORAGE_KEY);
    },
};

export default Auth;
