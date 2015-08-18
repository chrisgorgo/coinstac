'use strict';
import PouchWrapper from 'pouchdb-wrapper';
import config from 'config';
import _ from 'lodash';
const adapterDefaults = {
    conn: {
        protocol: config.db.remote.protocol,
        hostname: config.db.remote.hostname,
        port: config.db.remote.port,
    }
};
let dbs = [];

// TODO - determine how to stop spoofing the referer
// import url from 'url';
// const pouchOptions = {
//     ajax: {
//         headers: {
//             referer: url.format(adapterDefaults.conn)
//         }
//     }
// };

// TODO remove window global and live reporting
window.dbs = dbs;
window.log = function() {console.dir(arguments);};
let windowDbLog = (dbWrapper) => {
    dbWrapper.changes.on('change', window.log);
};
// end live reporting

dbs.registery = {};

/**
 * Register an app-level datastore
 * @param  {object} opts required options for a pouch-wrapper instance
 * @return {PouchWrapper} database instance
 */
dbs.register = function(opts) {
    let dbConfig = { conn: {}};
    _.extend(dbConfig.conn, adapterDefaults.conn);
    dbConfig.name = opts.label || opts.name;
    dbConfig.conn.pathname = (dbConfig.conn.pathname || dbConfig.name);
    let db = new PouchWrapper(dbConfig);
    dbs.registery[dbConfig.name] = db;
    dbs.push(db);
    windowDbLog(db); // ToDo remove!
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