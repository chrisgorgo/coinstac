'use strict';
var PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
var Events = require('ampersand-events');
var assign = require('lodash.assign');
var map = require('lodash.map');
var unique = require('lodash.uniq');

function PouchAdapter() {
}

assign(PouchAdapter.prototype, Events, {

    all: function() {
        return this.db.allDocs({
            include_docs: true
        }).then(function(docs) {
            return map(docs.rows, function(v) { return v.doc; });
        });
    },

    add: function(doc, opts) {
        // http://pouchdb.com/api.html#create_document
        // db.post(doc, [docId], [docRev], [options], [callback])
        return this.db.post(doc).then(function(meta) {
            delete meta.status;
            doc._id = meta.id;
            doc._rev = meta.rev;
            return doc;
        });
    },

    createDB: function(opts) {
        this.db = new PouchDB(this.minister.dbdir + '/' + this.name);
        return Promise.resolve(this);
    },

    createIndexes: function(indicies) {
        return this.db.createIndex({
            index: {
                fields: _.unique(indicies)
            }
        })
        .catch(function(err) {
            if (err.status !== 409) {
                throw err;
            }
        });
    },

    delete: function(doc, opts) {
        return this.db.remove(doc);
    },

    deleteDB: function(opts) {
        return this.db.destroy();
    },

    get: function(uid) {
        return this.db.get(uid);
    },

    update: function(doc, opts) {
        // http://pouchdb.com/api.html#create_document
        // db.put(doc, [docId], [docRev], [options], [callback])
        return this.db.put(doc, opts._id, opts._rev).then(function(meta) {
            delete meta.status;
            doc._id = meta.id;
            doc._rev = meta.rev;
            return doc;
        });
    },

    // https://github.com/nolanlawson/pouchdb-find#dbfindrequest--callback
    query: function(opts) {
        var query = {};
        var selectorKeys;
        query.selector = opts.selector;
        selectorKeys = Object.keys(query.selector);
        if (opts.fields) {
            query.fields = opts.fields;
        }

        if (opts.sort) {
            query.sort = opts.sort;
        }

        return this.db.find(query).then(function returnDocsArray(rslt) {
            return rslt.docs;
        });
    }

});

module.exports = PouchAdapter;
