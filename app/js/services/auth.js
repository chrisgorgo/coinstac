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
import hawk from 'hawk/lib/browser';
import Promise from 'bluebird';

/** Storage key used with `localStorage` for storing authentication headers */
const AUTH_RESPONSE_KEY = 'COINSTAC_AUTH_RESPONSE';

/** Storage key used with `localStorage` for storing user */
const USER_KEY = 'COINSTAC_USER';

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
            data,
            method: 'post',
            url: getApiUrl('/users'),
            withCredentials: true,
        })
            .then(() => Auth.login({ password, username }));
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
            data,
            method: 'post',
            url: getApiUrl('/auth/keys'),
            withCredentials: true,
        })
            .then(response => {
                const {
                    algorithm,
                    expireTime,
                    issueTime,
                    id,
                    key,
                    user,
                } = response.data.data[0];

                Auth.setAuthResponse({
                    algorithm,
                    expireTime,
                    issueTime,
                    id,
                    key,
                });

                return Auth.setUser(user);
            });
    },

    /**
     * Log out.
     *
     * @return {Promise} Axios's response
     */
    logout: function() {
        const authResponse = Auth.getAuthResponse();

        Auth.clearAuthResponse();
        Auth.clearUser();

        if (authResponse && authResponse.id) {
            const url = getApiUrl(`/auth/keys/${authResponse.id}`);
            const method = 'delete';
            const hawkHeaders = hawk.client.header(
                url,
                method.toUpperCase(),
                { credentials: authResponse }
            );

            return axios({
                headers: {
                    Authorization: hawkHeaders.field,
                },
                method,
                withCredentials: true,
                url,
            });
        } else {
            return Promise.resolve();
        }
    },

    /**
     * Save user.
     *
     * @param  {Object} user
     * @return {Object}
     */
    setUser: function(user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        return Auth.getUser();
    },

    /**
     * Get saved user.
     *
     * @return {object}
     */
    getUser: function() {
        let user;

        // Get stored user if needed
        if (localStorage.getItem(USER_KEY)) {
            user = JSON.parse(localStorage.getItem(USER_KEY));
        }

        return (user instanceof Object) ? user : {};
    },

    /**
     * Remove stored user
     *
     * @return {undefined}
     */
    clearUser: function() {
        localStorage.removeItem(USER_KEY);
    },

    /**
     * Set authentication response.
     *
     * @see Auth.getUser()
     *
     * @param  {Object}             auth
     * @return {(Object|undefined)} Stored auth response
     */
    setAuthResponse: function(auth) {
        localStorage.setItem(AUTH_RESPONSE_KEY, JSON.stringify(auth));
        return Auth.getAuthResponse();
    },

    /**
     * Get stored authentication response.
     *
     * @return {(Object|undefined)}
     */
    getAuthResponse: function() {
        if (localStorage.getItem(AUTH_RESPONSE_KEY)) {
            return JSON.parse(localStorage.getItem(AUTH_RESPONSE_KEY));
        }
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
