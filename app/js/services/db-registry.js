'use strict';
var Pouchy = require('pouchy');
var app = require('ampersand-app');
var config = require('config');
var _ = require('lodash');
var url = require('url');
var app = require('ampersand-app');
Pouchy.PouchDB.defaults({
    prefix: app.coinstacDir
});

var LOCAL_STORES = ['projects'];
var REMOTE_STORES_SYNC_IN = ['coinstac-users', 'coinstac-consortia'];
var REMOTE_STORES_SYNC_OUT = ['consortium-'];

var REMOTE_CONNECTION_DEFAULTS = {
    protocol: config.db.remote.protocol,
    hostname: config.db.remote.hostname,
    port: config.db.remote.port,
};

let dbs = [];
dbs.registery = {};

/**
 * @property {array} names returns an array of db names from the registry
 */
Object.defineProperty(dbs, 'names', {
    get: function() {
        return dbs.map(function(db) { return db.name });
    }
});


// Load db registry helper services onto window in dev
if (app.isDev) {
    window.dbs = dbs;
    window.log = function() {
        return _.toArray(arguments).forEach(function(arg, ndx) {
            console.info('log ndx: ', ndx);
            console.dir(arg);
        });
    };
}

/**
 * gets an existing or new instance of a db
 * @param  {string} nameOrUrl name of db or url to remote db
 * @return {Pouchy}
 */
dbs.get = function(nameOrUrl) {
    let config = {};
    if (nameOrUrl.match(/^http/) || nameOrUrl.match(/^\//)) {
        config = { url: nameOrUrl };
    } else {
        config = { name: nameOrUrl };
    }
    if (dbs.registery[nameOrUrl]) {
        return dbs.registery[nameOrUrl];
    }
    return dbs.register(config);
}

/**
 * Register an app-level datastore
 * @param  {object} opts required options for a Pouchy instance
 * @option {string} name
 * @return {Pouchy} database instance
 */
dbs.register = function(opts) {
    var dbConnStr = opts.name || opts.url;
    // assert db can register, and configure its domain
    if (LOCAL_STORES.some(function(format) { return _.contains(dbConnStr, format); })) {
        if (!app.coinstacDir) {
            throw new TypeError('path must be specified for db');
        }
        opts.path = app.coinstacDir;
    } else if (REMOTE_STORES_SYNC_OUT.some(function(format) { return _.contains(dbConnStr, format); })) {
        if (!app.coinstacDir) {
            throw new TypeError('path must be specified for db');
        }
        opts.path = app.coinstacDir;
        opts.replicate = 'both'; // @TODO outbound replications to happen manually using `replicate.to()`
    } else if (REMOTE_STORES_SYNC_IN.some(function(format) { return _.contains(dbConnStr, format); })) {
        opts.replicate = 'in';
    } else {
        throw new ReferenceError(`database ${name} does not fit LOCAL or REMOTE database varraints`);
    }

    // build db and cache it
    let db = new Pouchy(opts);
    dbs.registery[opts.name] = db;
    dbs.push(db);
    return db;
};

/**
 * Removes database from registry
 * @param  {string} name
 * @return {undefined}
 */
dbs.unregister = function(name) {
    let toRemove = dbs.registery['name'];
    if (!toRemove) {
        throw new ReferenceError('db "' + name + '" not found. unable to remove');
    }
    dbs = _.without(dbs, toRemove);
    delete dbs.registery[name];
}

module.exports = dbs;
