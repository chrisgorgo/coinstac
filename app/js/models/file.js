'use strict';
var Model = require('ampersand-model');
var config = require('config');
var path = require('path');

module.exports = Model.extend({
    apiRoot: config.api.url,
    idAttribute: 'path',
    props: {
        filename: ['string', true],
        dirname: ['string', true],
        sha: ['string', true]
    },
    derived: {
        path: {
            deps: ['filename', 'dirname'],
            fn: function() {
                return path.join(this.dirname, this.filename);
            }
        }
    },
    session: {
        db: 'object' // pouch-wrapper instance
    }
});
