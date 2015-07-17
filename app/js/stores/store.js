'use strict';
import dbRegistry from '../services/db-registry';
import _ from 'lodash';

class Store {
    constructor(name) {
        if (!name) {
            throw new ReferenceError('no name provided');
        }
        this.name = name;
        this.items = [];
        this.registry = {};
    }
    map(cb) {
        return this.items.map((item) => { return cb(item); });
    }
    getBy(prop, val) {
        return _.find(this.items, _.matchesProperty(prop, val));
    }
    register(item) {
        let existing = this.getBy('_id', item._id);
        if (!existing) {
            this.items.push(item);
            this.registry[item._id] = item;
            return item;
        }
        return existing;
    }
    unregister(item) {
        this.items = _.without(this.items, item);
        delete this.registry[item._id];
    }
}

class ConsortiaStore extends Store {
    register(consortium) {
        consortium = super.register(consortium);
        if (!consortium.db) {
            consortium.db = dbRegistry.register({
                name: consortium.label || consortium.name,
                replicate: 'sync'
            });
        }
        return consortium;
    }
}

let fileStore = new Store('files');
[
    {filename:'my-file-1', sha: 'sha-my-file-1'},
    {filename:'my-file-2', sha: 'sha-my-file-2'},
    {filename:'my-file-3', sha: 'sha-my-file-3'},
    {filename:'my-file-4', sha: 'sha-my-file-4'},
    {filename:'my-file-5', sha: 'sha-my-file-5'},
    {filename:'my-file-6', sha: 'sha-my-file-6'},
    {filename:'file-id-88', sha: 'sha-file-id-88'},
    {filename:'file-id-99', sha: 'sha-file-id-99'}
].forEach((data) => { fileStore.register(data); });

let projectStore = new Store('projects');
[{
    id: 'project-101',
    name: 'My Sweet Project',
    files: ['file-id-1', 'file-id-2', 'file-id-3'],
    consortia: ['consortia1']
}, {
    id: 'project-103',
    name: 'My Okay Project',
    files: ['file-id-88', 'file-id-99'],
    consortia: ['consortia1']
}].forEach((data) => { projectStore.register(data); });


let consortiaStore = new ConsortiaStore('consortia');

export default {
    projectStore,
    consortiaStore,
    fileStore
};