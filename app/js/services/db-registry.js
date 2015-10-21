'use strict';
var Pouchy = require('pouchy');
var app = require('ampersand-app');
var config = require('config');
var _ = require('lodash');
var url = require('url');
var app = require('ampersand-app');

var appDirectory = require('../../common/utils/app-directory');

var LOCAL_STORES = ['projects'];
var REMOTE_STORES_SYNC_IN = ['coinstac-users', 'coinstac-consortia'];
var REMOTE_STORES_SYNC_OUT = ['consortium-', 'consortiameta'];

Pouchy.PouchDB.defaults({
    prefix: appDirectory
});

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
 * Register an app-level datastore.
 *
 * @param  {object} opts      Required options for a Pouchy instance
 * @param  {string} opts.name Store's registered name, see `LOCAL_STORES`,
 *                            `REMOTE_STORES_SYNC_IN` and
 *                            `REMOTE_STORES_SYNC_OUT`
 * @param  {string} opts.url  Store's URL
 * @return {Pouchy}           Database instance
 */
dbs.register = function(opts) {
    var dbConnStr = opts.name || opts.url;
    var db;

    /**
     * Store contains `dbConnStr`.
     *
     * @param  {array}   store
     * @return {boolean}
     */
    function hasDbConnStr(store) {
        return store.some(function(format) {
            return _.contains(dbConnStr, format);
        });
    }

    // assert db can register, and configure its domain
    if (hasDbConnStr(LOCAL_STORES)) {
        opts.path = appDirectory;
    } else if (hasDbConnStr(REMOTE_STORES_SYNC_OUT)) {
        opts.path = appDirectory;

        // @TODO outbound replications to happen manually using `replicate.to()`
        opts.replicate = 'both';
    } else if (hasDbConnStr(REMOTE_STORES_SYNC_IN)) {
        opts.replicate = 'in';
    } else {
        throw new ReferenceError(
            `database ${name} does not fit LOCAL or REMOTE database variants`
        );
    }

    // build db and cache it
    db = new Pouchy(opts);
    dbs.registery[opts.name] = db;
    dbs.registery[opts.url] = db;
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
