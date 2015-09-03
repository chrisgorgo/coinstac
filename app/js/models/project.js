'use strict';
var PouchDocument = require('./pouch-document');
var FileCollection = require('./file-collection');
var config = require('config');
var dbs = require('../services/db-registry.js');

var Project = PouchDocument.extend({
    apiRoot: config.api.url,
    initialize: function() {
        PouchDocument.prototype.initialize.call(this);
        this.on('change:name', this.handleNameChange);
    },
    collections: {
        files: FileCollection
    },
    derived: {
        db: {
            deps: ['_id'],
            fn: function() {
                if (!this._id) {
                    throw new ReferenceError('project must be saved prior to accessing it\'s db');
                }
                return dbs.get('project-files-' + this._id);
            }
        }
    },
    handleNameChange: function() {
        // assert that project `name` has content
        if (this.name) {
            this.set('_errorName', null);
        } else {
            this.set('_errorName', 'Name required');
        }
    },
    props: {
        name: ['string', true],
        defaultConsortiumId: ['string', false]
    },
    session: {
        _errorName: 'string'
    },
    /**
     * Serialize, with support for including derived attrs
     * @note - PR https://github.com/AmpersandJS/ampersand-state/pull/193 to make this out-of-box behavior
     * @param  {object} opts
     * @option {boolean} session - include session vars in serialization
     * @return {[type]}      [description]
     */
    serialize: function(opts) {
        var tserialized = PouchDocument.prototype.serialize.call(this);
        if (opts && opts.session) {
            tserialized._errorName = this._errorName;
        }
        return tserialized;
    }
});

module.exports = Project;

// .: sandbox :.
// var p1 = new Project({
//     _id: 'abc',
//     files: [{a: 'a'}, {b: 'b'}]
// });
// console.log(p1.serialize());