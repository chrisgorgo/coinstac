'use strict';
var PouchDocument = require('./pouch-document');
var FileCollection = require('./file-collection');
var config = require('config');
var dbs = require('../services/db-registry.js');

var Project = PouchDocument.extend({
    initialize: function() {
        PouchDocument.prototype.initialize.apply(this, arguments);
        this.on('change:name', this.handleNameChange);
    },
    collections: {
        files: FileCollection
    },
    props: {
        name: ['string', true],
        defaultConsortiumId: ['string', false],
        defaultAnalysisId: ['string', false],
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