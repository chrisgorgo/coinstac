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
        users: ['collection', true],
        analyses: ['collection', true]
    },
    session: {
        db: 'object' // pouch-wrapper instance
    }
});

