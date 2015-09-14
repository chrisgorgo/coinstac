/**
 * Authentication service.
 *
 * Make authentication requests to the COINS and COINSTAC API. This enables user
 * login/logout and the creation of new users.
 *
 * @todo  Integrate with Redux in the form of middleware.
 */

import url from 'url';

import axios from 'axios'
import config from 'config';
import User from '../models/user';

/** Storage key used with `localStorage` for storing authentication headers */
const AUTH_RESPONSE_KEY = 'COINSTAC_AUTH_RESPONSE';

/** Storage key used with `localStorage` for storing user */
const USER_KEY = 'COINSTAC_USER';

/** Hold a private reference to the user model */
let user;

/**
 * API URL format helper.
 *
 * @param  {string} endpoint
 * @return {string}
 */
function getApiUrl(endpoint) {
    return url.format(config.api) + endpoint;
}

/**
 * Auth.
 *
 * @todo  Document object.
 */
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
        const { user = { id } } = Auth.getUser();
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
        localStorage.setItem(USER_KEY, JSON.stringify(user.serialize()));
        return Auth.getUser();
    },

    /**
     * Get saved user.
     *
     * @return {Object|undefined}
     */
    getUser: function() {
        // Get stored user if needed
        if (!user && localStorage[USER_KEY]) {
            user = new User(JSON.parse(localStorage.getItem(USER_KEY)));
        }

        if (user && user.isValid()) {
            return {
                email: user.get('email'),
                institution: user.get('institution'),
                name: user.get('name'),
                username: user.get('username'),
            };
        }
    },

    /**
     * Remove stored user
     *
     * @return {undefined}
     */
    clearUser: function() {
        if (user) {
            user.clear();
        }
    },

    /**
     * Set authentication response.
     *
     * @see Auth.getUser()
     *
     * @param  {Object}           auth
     * @return {Object|undefined} Stored auth response
     */
    setAuthResponse: function(auth) {
        localStorage.setItem(AUTH_RESPONSE_KEY, JSON.stringify(auth));
        return Auth.getUser();
    },

    /**
     * Clear stored authentication response.
     *
     * @return {undefined}
     */
    clearAuthResponse: function() {
        localStorage.removeItem(AUTH_RESPONSE_KEY);
    },
};

export default Auth;
