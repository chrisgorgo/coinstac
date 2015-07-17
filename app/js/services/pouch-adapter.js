'use strict';
var PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
var _ = require('lodash');
var url = require('url');
var config = require('config');

function PouchAdapter(opts) {
    var dbUrl = url.format(opts.conn).toLowerCase();
    var replicate = opts.replicate;
    this.name = _.kebabCase(opts.name.toLowerCase());
    if (!this.name) {
        throw new ReferenceError('db name required');
    }
    this.db = new PouchDB(dbUrl, {
        ajax: {
            headers: {
                referer: 'http://localhost:5984/' //config.api.url
            }
        }
    });
    this.changes = this.db.changes({
        since: 'now',
        live: true,
        include_docs: true // jshint ignore:line
    });
    if (replicate) {
        switch (replicate) {
            case 'out':
                PouchDB.replicate(this.name, dbUrl, {live: true});
                break;
            case 'in':
                PouchDB.replicate(dbUrl, this.name, {live: true});
                break;
            case 'sync':
                PouchDB.replicate(this.name, dbUrl, {live: true});
                PouchDB.replicate(dbUrl, this.name, {live: true});
                break;
            default:
                throw new Error('in/out replication direction ' +
                    'must be specified');
        }
    }
}

_.assign(PouchAdapter.prototype, {

    all: function(opts) {
        return this.db.allDocs(_.defaults(opts || {}, {
            include_docs: true // jshint ignore:line
        })).then(function(docs) {
            return _.map(docs.rows, function(v) { return v.doc; });
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
                fields: _.unique(indicies)
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

    deleteAll: function(doc, opts) { // jshint ignore:line
        return this.all().then(function deleteEach(docs) {
            docs = docs.map((doc) => { return this.delete(doc); });
            return Promise.all(docs);
        }.bind(this));
    },

    deleteDB: function(opts) { // jshint ignore:line
        return this.db.destroy();
    },

    get: function(uid) {
        return this.db.get(uid);
    },

    on: function(evt, cb) {
        this.changes.on(evt, cb);
    },

    off: function(evt, cb) {
        if (!cb) {
            throw new ReferenceError('listener to stop listening to must be specified');
        }
        this.changes.removeListener(evt, cb);
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
        query.selector = opts.selector;
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