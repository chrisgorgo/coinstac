'use strict';
var PouchDocument = require('./pouch-document');
var config = require('config');

module.exports = PouchDocument.extend({
    apiRoot: config.api.url,
    props: {
        name: ['string', true]
    },
    session: {
        db: 'object' // pouch-wrapper instance
    }
});
