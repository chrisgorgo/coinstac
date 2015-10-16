/**
 * @package analysis
 * render-process i/o interface to main-process for analysis requests
 * between main & render process
 *
 * @property {array} inprocess set of inprocess requests
 *
 */

import ipc from 'ipc';
import _ from 'lodash';
import EventEmitter from 'event-emitter';

class Analyze {

    constructor() {
        this.inprocess = [];
        this.emitter = EventEmitter();
        ipc.on('files-analyzed', this.handleAnalyzed.bind(this));
    }

    /**
     * listen to files-analyzed events
     * @param {function} callback receives a single `results` object.
     *     See ./main/services/analyze.js for object format
     */
    addChangeListener(callback) {
        this.emitter.on('change', callback);
    }

    removeChangeListener(callback) {
        this.emitter.off('change', callback);
    }

    /**
     * send request to analyze files
     *
     * @todo  Improve documentation
     *
     * @param  {object} request
     * @option {array}  files array of files of form `file`.  See models/file.js
     * @option {number} requestId recommended requestId so that render process
     *     may easily identify analyze requests from one another
     * @return {undefined}
     */
    analyze(request) {
        if (!request.files || !Array.isArray(request.files)) {
            throw new ReferenceError('`files` set required');
        }
        if (!request.type || ['one', 'multi'].indexOf(request.type) === -1) {
            throw new ReferenceError('`type` property required!');
        }
        if (request.type === 'multi' && !_.isObject(request.mVals)) {
            throw new ReferenceError('A set `mVals` property requires `request.type` is an object.');
        }
        if (!request.requestId) {
            throw new ReferenceError('use `requestId` to identify async analyze requests');
        }
        this.inprocess.push(request);
        ipc.send('analyze-files', request);
    }

    handleAnalyzed(results) {
        if (!results.hasOwnProperty('requestId')) {
            throw new ReferenceError('analyzed response missing `requestId`');
        }
        this.inprocess = _.filter(this.inprocess, (req) => {
            return req !== results.requestId;
        });
        this.emitter.emit('change', results);
    }

};

export default new Analyze();
