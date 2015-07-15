'use strict';

import _ from 'lodash';
import EventEmitter from 'event-emitter';
var ipc = require('ipc');

const STORAGE_KEY = 'coinstac-files';
const emitter = EventEmitter();

ipc.on('files-added', function (files) {
    if (files) {
        files.forEach(FileStore.saveFile.bind(FileStore));
    }
});

const FileStore = {
    addChangeListener: function (callback) {
        emitter.on('change', callback);
    },
    removeChangeListener: function (callback) {
        emitter.off('change', callback);
    },
    getFilesFromUser: function() {
        ipc.send('add-file');
    },
    getSavedFiles: function() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY));
    },
    saveFile: function(file) {
        let files = this.getSavedFiles();

        // Don't save if file is already saved
        if (_.find(files, savedFile => savedFile.filename === file.filename)) {
            // TODO: Implement app-level notifications for this
            throw new Error(`File already saved: ${file.filename}`);
        }

        files.push(file);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
        emitter.emit('change');
    },
    removeFileByPath: function(path) {
        const files = this.getSavedFiles();
        /** @{@link  https://lodash.com/docs/#findIndex} */
        const index = _.findIndex(files, file => file.filename === path);
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

// Initialize
if (!FileStore.getSavedFiles()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
}

export default FileStore;
