'use strict';
import xhr from 'xhr';
import { Promise } from 'rsvp';
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
            resolve(docs);
        });
    });
}

export default {
    getAll: function() {
        return new Promise(function (resolve, reject) {
            _getAll().then(function (storage) {
                resolve(storage);
            }).catch(function (err) {
                reject(err);
            });
        });
    },
    getByLabel: function (label) {
        return new Promise(function (resolve, reject) {
            _getAll().then(function (docs) {
                const consortium = _.find(docs, doc => {
                    return doc.label === label;
                });

                if (consortium) {
                    resolve(consortium);
                } else {
                    reject(`Could not not find ${label}`);
                }
            }).catch(err => reject(err));
        });
    }
};
