'use strict';
var PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
var assign = require('lodash.assign');
var map = require('lodash.map');
var unique = require('lodash.uniq');
var isArray = require('lodash.isarray');
var url = require('url');

function PouchAdapter(opts) {
    var dbUrl = url.format(opts.conn);
    var replicate = opts.replicate;
    if (!opts.name) {
        throw new ReferenceError('db name required');
    }
    this.db = new PouchDB(dbUrl);
    if (replicate) {
        replicate = isArray(replicate) ? replicate : [replicate];
        replicate.forEach(function setReplicationRequest(rep) {
            switch (rep.dir) {
                case 'out':
                    PouchDB.replicate(opts.name, dbUrl, {live: true});
                    break;
                case 'in':
                    PouchDB.replicate(dbUrl, opts.name, {live: true});
                    break;
                default:
                    throw new Error('in/out replication direction ' +
                        'must be specified');
            }
        });
    }
}

assign(PouchAdapter.prototype, {

    all: function() {
        return this.db.allDocs({
            include_docs: true // jshint ignore:line
        }).then(function(docs) {
            return map(docs.rows, function(v) { return v.doc; });
        });
    },

    add: function(doc, opts) { // jshint ignore:line
        // http://pouchdb.com/api.html#create_document
        // db.post(doc, [docId], [docRev], [options], [callback])
        return this.db.post(doc).then(function(meta) {
            delete meta.status;
            doc._id = meta.id;
            doc._rev = meta.rev;
            return doc;
        });
    },

    createIndexes: function(indicies) {
        return this.db.createIndex({
            index: {
                fields: unique(indicies)
            }
        })
        .catch(function(err) {
            if (err.status !== 409) {
                throw err;
            }
        });
    },

    delete: function(doc, opts) { // jshint ignore:line
        return this.db.remove(doc);
    },

    deleteDB: function(opts) { // jshint ignore:line
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
