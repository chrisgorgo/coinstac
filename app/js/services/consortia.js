'use strict';
import xhr from 'xhr';
import {consortiaStore} from '../stores/store';
import _ from 'lodash';
import config from 'config';

function _getAll() {
    let docs;
    return new Promise(function (resolve, reject) {
        xhr({
            uri: config.api.url + '/consortia'
        }, function (err, res, body) {
            if (err) {
                reject(err);
            }

            docs = JSON.parse(body).map(row => {
                return row.doc;
            });
            docs = docs.map((doc) => {
                return consortiaStore.register(doc);
            });
            resolve(docs);
        });
    });
}

class ConsortiaService {
    getAll() {
        return new Promise(function (resolve, reject) {
            _getAll().then(function (docs) {
                resolve(docs);
            }).catch(function (err) {
                reject(err);
            });
        });
    }
    getBy(prop, val) {
        return new Promise(function (resolve, reject) {
            _getAll()
                .then(function (docs) {
                    const consortium = _.find(docs, doc => {
                        return doc[prop] === val;
                    });
                    if (consortium) {
                        resolve(consortium);
                    } else {
                        reject(`Could not not find ${prop} equal to ${val}`);
                    }
                })
                .catch(err => reject(err));
        });
    }
    getByLabel(label) {
        return this.getBy('label', label);
    }
}

export default new ConsortiaService();