'use strict';
import PouchAdapter from '../services/pouch-adapter';
import config from 'config';
import _ from 'lodash';

let dbs = [];
let adapterDefaults = {
    conn: {
        protocol: config.db.remote.protocol,
        hostname: config.db.remote.hostname,
        port: config.db.remote.port,
    }
};

// TODO remove window global and live reporting
window.dbs = dbs;
window.log = function() {console.dir(arguments);};
let windowDbLog = (dbWrapper) => {
    dbWrapper.changes.on('change', window.log);
};
// end live reporting

dbs.registery = {};
dbs.register = function(opts) {
    let dbConfig = _.defaultsDeep(opts, adapterDefaults);
    dbConfig.conn.pathname = dbConfig.conn.pathname || dbConfig.name;
    let db = new PouchAdapter(dbConfig);
    dbs.registery[opts.name] = db;
    dbs.push(db);
    windowDbLog(db); // ToDo remove!
    return db;
};


export default dbs;
