// @todo - move entirely to remote couch sync'd db, and use pouchdb-wrapper.find to get elements
'use strict';
import axios from 'axios';
import {dbs} from './db-registry';
import _ from 'lodash';
import config from 'config';

class ConsortiaService {
    constructor() {

    }

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
}

export default new ConsortiaService();