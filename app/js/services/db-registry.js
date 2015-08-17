'use strict';
import PouchWrapper from 'pouch-wrapper';
import config from 'config';
import _ from 'lodash';

let dbs = [];
const adapterDefaults = {
    conn: {
        protocol: config.db.remote.protocol,
        hostname: config.db.remote.hostname,
        port: config.db.remote.port,
    }
};

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
dbs.register = function(opts) {
    let dbConfig = { conn: {}};
    _.extend(dbConfig.conn, adapterDefaults.conn);
    dbConfig.name = _.kebabCase(opts.label || opts.name);
    dbConfig.conn.pathname = (dbConfig.conn.pathname || dbConfig.name);
    let db = new PouchWrapper(dbConfig);
    dbs.registery[dbConfig.name] = db;
    dbs.push(db);
    windowDbLog(db); // ToDo remove!
    return db;
};

export default dbs;