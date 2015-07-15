'use strict';
import PouchAdapter from '../services/pouch-adapter';
let dbs = window.dbs = []; // TODO remove window global

dbs.register = function(opts) {
    let db = new PouchAdapter(opts);
    dbs.push(db);
    return db;
};

export default dbs;
