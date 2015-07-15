'use strict'

import xhr from 'xhr';
import { Promise } from 'rsvp';
import _ from 'lodash';

// TODO: Implement better storage
let Storage;

function getStorage() {
    return new Promise(function (resolve, reject) {
        if (Storage) {
            resolve(Storage);
        }

        xhr(
            { uri: 'http://localhost:3001/consortia' },
            function (err, res, body) {
                if (err) {
                    reject(err);
                } else if (res.statusCode.toString().charAt(0) !== '2') {
                    reject('Bad request: ' + res.toString());
                }

                Storage = JSON.parse(body);

                resolve(Storage);
            }
        );
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
