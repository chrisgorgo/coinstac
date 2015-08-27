'use strict';
var Model = require('ampersand-model');
var PouchDocument = require('./pouch-document.js');
var config = require('config');

module.exports = PouchDocument.extend({
    apiRoot: config.api.url,
    props: {
        description: ['string', true],
        label: ['string', true],
        tags: ['array', true],
        users: ['array', true],
        analyses: ['array', true]
    },
    session: {
        db: 'object' // pouch-wrapper instance
    }
});

