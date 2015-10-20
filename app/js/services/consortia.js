// @todo - move entirely to remote couch sync'd db, and use pouchdb-wrapper.find to get elements

import _ from 'lodash';
import axios from 'axios';
import config from 'config';

import auth from './auth';
import dbs from './db-registry';

class ConsortiaService {

    all() {
        return axios.get(config.api.url + '/coinstac/consortia')
        .then((res) => { return res.data.data; });
    }

    getBy(prop, val) {
        return this.all()
            .then(function(docs) {
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

    /**
     * Get consortia that a user has joined.
     *
     * @param  {string}  username
     * @return {Promise}          Resolves to an array of consortium objects as
     *                            provided by the API.
     */
    getUserConsortia(username) {
        const queryUsername = !!username ?
            username :
            auth.getUser().username;

        if (!queryUsername) {
            return Promise.reject('No username provided');
        }

        return this.all()
            .then(consortia => {
                return consortia.filter(consortium => {
                    return consortium.users.some(user => {
                        return user.username === queryUsername;
                    });
                });
            });
    }
}

export default new ConsortiaService();
