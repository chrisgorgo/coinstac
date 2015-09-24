'use strict';
import Pouchy from 'pouchy';
import app from 'ampersand-app';
import config from 'config';
import _ from 'lodash';
import url from 'url';

const LOCAL_STORES = ['projects'];
const REMOTE_STORES_SYNC_IN = ['coinstac-users', 'coinstac-consortia'];
const REMOTE_STORES_SYNC_OUT = ['consortium-'];

const REMOTE_CONNECTION_DEFAULTS = {
    protocol: config.db.remote.protocol,
    hostname: config.db.remote.hostname,
    port: config.db.remote.port,
};

let dbs = [];
dbs.registery = {};

/**
 * @property {array} names returns an array of db names from the registry
 */
Object.defineProperty(dbs, 'names', { get: () => {
    return dbs.map(db => db.name);
}});


// Load db registry helper services onto window in dev
if (app.isDev) {
    window.dbs = dbs;
    window.log = function() {
        return _.toArray(arguments).forEach((arg, ndx) => {
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
    if (LOCAL_STORES.some(format => { return _.contains(dbConnStr, format); })) {
        // pass. `name` only shall yield local database
    } else if (REMOTE_STORES_SYNC_OUT.some(format => { return _.contains(dbConnStr, format); })) {
        opts.replicate = 'both'; // @TODO outbound replications to happen manually using `replicate.to()`
    } else if (REMOTE_STORES_SYNC_IN.some(format => { return _.contains(dbConnStr, format); })) {
        opts.replicate = 'in';
    } else {
        throw new ReferenceError(`database ${name} does not fit LOCAL or REMOTE database constraints`);
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

export default dbs;
