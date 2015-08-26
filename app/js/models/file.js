'use strict';
var Model = require('ampersand-model');
var PouchDocument = require('./pouch-document.js');
var config = require('config');

module.exports = PouchDocument.extend({
    apiRoot: config.api.url,
    props: {
        path: ['string', true],
        filename: ['string', true],
        dirname: ['string', true],
        sha: ['string', true]
    },
    session: {
        db: 'object' // pouch-wrapper instance
    }
});
