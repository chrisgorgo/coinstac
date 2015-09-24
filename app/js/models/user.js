'use strict';
var Model = require('./base.js');
var config = require('config');

module.exports = Model.extend({
    props: {
        username: ['string', true],
        email: ['string', true],
        institution: ['string', true],
        name: ['string', true]
    },
    session: {
        password: ['string', false]
    }
});
