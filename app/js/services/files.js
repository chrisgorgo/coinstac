'use strict';
import _ from 'lodash';
import dbs from '../services/db-registry.js'
import EventEmitter from 'event-emitter';
import sha from 'sha';
import path from 'path';
import app from 'ampersand-app';
const emitter = EventEmitter(); // jshint ignore:line

var ipc = require('ipc');

ipc.on('files-added', function(event) {
    const { files, dbName } = event;
    if (files) {
        files.forEach(file => {
            FileStore.saveFile(file, dbName);
        });
    }
});

const FileStore = { // jshint ignore:line
    addChangeListener: function (callback) {
        emitter.on('change', callback);
    },
    removeChangeListener: function (callback) {
        emitter.off('change', callback);
    },
    getFilesFromUser: function(db) {
        if (!db || !db.name) {
            throw new ReferenceError('db for storing file meta missing');
        }
        ipc.send('add-file', {dbName: db.name});
    },
    saveFile: function(file, dbName) {
        dbs.get(dbName).all()
        .then(files => {
            file.path = file.filename;
            file.filename = path.basename(file.path);
            file.dirname = path.dirname(file.path);
            file.sha = sha.getSync(file.path);

            // Don't save if file is already saved
            if (files.some(savedFile => savedFile.sha === file.sha)) {
                const errMsg = `File already saved: ${file.filename}`;
                app.notifications.push({
                    message: errMsg,
                    level: 'error'
                });
                throw new Error(errMsg);
            }
            // convert web file api naming conventions to node naming conventions
            dbs.get(dbName).add(file)
            .then(rslt => { emitter.emit('change'); })
            .catch(err => { console.dir(err); });
        })

    },
    removeFileByPath: function(path) {
        const files = this.getSavedFiles();
        /** @{@link  https://lodash.com/docs/#findIndex} */
        const index = _.findIndex(files, file => file.path === path);
        let removedFile;

        if (index !== -1) {
            removedFile = files.splice(index, 1);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
            emitter.emit('change');
            return removedFile;
        } else {
            throw new Error(`Could not remove file: ${path}`);
        }
    }
};

export default FileStore;
