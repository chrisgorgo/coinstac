/**
 * @package FileBus
 * Provide a filesytem interface between renderer thread and main electron thread.
 * This service can be used to trigger OS Native file actions and return meta
 * back to the UI
 */
import app from 'ampersand-app';
import _ from 'lodash';
import dbs from '../services/db-registry.js'
import EventEmitter from 'event-emitter';
import sha from 'sha';
import path from 'path';
var ipc = require('ipc');
const emitter = EventEmitter();

const FileBus = { // jshint ignore:line
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
        ipc.send('select-files', {dbName: db.name});
    },
    _processFileSelections: function(event) {
        const { files, dbName } = event;
        files.forEach(file => {
            this.cacheFileReference(file, dbName);
        }.bind(this));
    },
    cacheFileReference: function(file, dbName) {
        dbs.get(dbName).all()
        .then(files => {
            file.path = file.filename;
            file.filename = path.basename(file.path);
            file.dirname = path.dirname(file.path);
            file.sha = sha.getSync(file.path);
            file._id = path.join(file.dirname, file.filename);

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
            .catch(err => {
                emitter.emit('error', err);
                console.dir(err);
            });
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

ipc.on('files-selected',(evt) => {
    FileBus._processFileSelections.call(FileBus, evt);
});

export default FileBus;
