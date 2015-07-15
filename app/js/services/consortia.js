'use strict';
import xhr from 'xhr';
import { Promise } from 'rsvp';
import _ from 'lodash';
let config = window.config;

// TODO: Implement better storage
let Storage;

function getStorage() {
    return new Promise(function (resolve, reject) {
        xhr({
            uri: config.api.url + '/consortia'
        }, function (err, res, body) {
            if (err) {
                reject(err);
            }

            Storage = JSON.parse(body);

            resolve(Storage);
        });
    });
}

export default {
    getAll: function() {
        return new Promise(function (resolve, reject) {
            getStorage().then(function (storage) {
                resolve(storage);
            }).catch(function (err) {
                reject(err);
            });
        });
    },
    getByLabel: function (label) {
        return new Promise(function (resolve, reject) {
            getStorage().then(function (storage) {

                const consortium = _.find(storage, item => {
                    return item.doc.label === label;
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
