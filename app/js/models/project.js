'use strict';
var PouchDocument = require('./pouch-document');
var Collection = require('ampersand-collection');
var config = require('config');
// var dbs = require('../services/db-registry.js');

var Project = PouchDocument.extend({
    apiRoot: config.api.url,
    props: {
        name: ['string', true],
        defaultConsortiumId: ['string', false]
    },
    // derived: {
    //     db: {
    //         fn: function() {
    //             return dbs.get(this.name);
    //         }
    //     }
    // },
    collections: {
        files: Collection
    }
});

module.exports = Project;

// .: sandbox :.
// var p1 = new Project({
//     _id: 'abc',
//     files: [{a: 'a'}, {b: 'b'}]
// });
// console.log(p1.serialize());