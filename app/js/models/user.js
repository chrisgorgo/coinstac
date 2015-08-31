'use strict';
var Model = require('ampersand-model');
var config = require('config');

module.exports = Model.extend({
    apiRoot: config.api.url,
    props: {
        username: ['string', true],
        password: ['string', true],
        email: ['string', true],
        institution: ['string', true],
        name: ['string', true]
    }
});
