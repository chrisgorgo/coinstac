'use strict';
import PouchWrapper from 'pouchdb-wrapper';
import config from 'config';
import _ from 'lodash';

const LOCAL_STORES = ['projects', 'project-files-'];
const REMOTE_STORES = ['coinstac-users', 'coinstac-consortia'];

const REMOTE_CONNECTION_DEFAULTS = {
    protocol: config.db.remote.protocol,
    hostname: config.db.remote.hostname,
    port: config.db.remote.port,
};

let dbs = [];
dbs.registery = {};

Object.defineProperty(dbs, 'names', { get: () => {
    return dbs.map(db => db.name);
}});


// TODO remove window global and live reporting
window.dbs = dbs;
window.log = function() {console.dir(_.toArray(arguments));};
let windowDbLog = (dbWrapper) => {
    dbWrapper.changes.on('change', window.log);
};


/**
 * gets an existing or new instance of a db
 * @param  {string} name
 * @return {PouchW}
 */
dbs.get = function(name) {
    name = _.kebabCase(name);
    if (dbs.registery[name]) {
        return dbs.registery[name];
    }
    return dbs.register({ name });
}

/**
 * Register an app-level datastore
 * @param  {object} opts required options for a pouch-wrapper instance
 * @option {string} name
 * @return {PouchWrapper} database instance
 */
dbs.register = function(opts) {
    if (!opts.name) {
        throw new ReferenceError('database registration requires `name` property');
    }

    // assert db can register, and configure its domain
    if (LOCAL_STORES.some(store => { return _.contains(opts.name, store); })) {
        // pass. `name` only shall yield local database
    } else if (REMOTE_STORES.some(store => { return _.contains(opts.name, store); })) {
        opts.conn = _.clone(REMOTE_CONNECTION_DEFAULTS);
        opts.conn.pathname = opts.name;
    } else {
        throw new ReferenceError(`database ${name} does not fit LOCAL or REMOTE database constraints`);
    }

    // build db and cache it
    let db = new PouchWrapper(opts);
    dbs.registery[opts.name] = db;
    dbs.push(db);
    windowDbLog(db);
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
