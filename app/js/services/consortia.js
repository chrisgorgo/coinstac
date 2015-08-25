// @todo - move entirely to remote couch sync'd db, and use pouchdb-wrapper.find to get elements
'use strict';
import xhr from 'xhr';
import {dbs} from './db-registry';
import _ from 'lodash';
import config from 'config';

class ConsortiaService {
    constructor() {

    }
    getAll() {
        let docs;
        return new Promise(function (resolve, reject) {
            xhr({
                uri: config.api.url + '/consortia',
                json: true
            }, function (err, res, body) {
                if (err) {
                    return reject(err);
                }
                return resolve(res.body.data); // res.body.data => consortia docs
            });
        });
    }
    getBy(prop, val) {
        return this.getAll()
            .then(function (docs) {
                const consortium = _.find(docs, (doc) => {
                    return doc[prop] === val;
                });
                if (consortium) {
                    return(consortium);
                }
                throw new ReferenceError(`Could not not find ${prop} equal to ${val}`);
            });
    }
    getByLabel(label) {
        return this.getBy('label', label);
    }
}

export default new ConsortiaService();