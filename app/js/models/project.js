'use strict';
var PouchDocument = require('./pouch-document');
var config = require('config');
var dbs = require('../services/db-registry.js')

module.exports = PouchDocument.extend({
    apiRoot: config.api.url,
    derived: {
        db: {
            fn: () => {
                return dbs.get(this.name);
            }
        }
    },
    props: {
        name: ['string', true],
        defaultConsortiumId: ['string', false]
    }
});
