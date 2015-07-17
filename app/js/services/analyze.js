'use strict';
import _ from 'lodash';

const assertIndexes = (db) => {
    return db.createIndexes(['sha']);
};

/**
 * runs all of the provided consortium's analyitics on the provided files,
 * then stores them to the database.  files already present are ignored
 * @param  {object} conf {
 *     files: [of files],
 *     consortium: {object},
 *     db: PouchAdapter
 * }
 * @return {promise}      [description]
 */
const run = async (conf) => {
    try {
        let files = conf.files;
        let consortium = conf.consortium;
        let db = conf.db;
        files = _.isArray(files) ? files : [files];
        // await assertIndexes(db); // ToDo no redundancy check in place. awaiting response on https://github.com/nolanlawson/pouchdb-find/issues/50
        if (!consortium.analyses) {
            throw new ReferenceError('no analysis found for consortium');
        }
        let processing = consortium.analyses.map((analysis) => {
            let analyzeFn = analysis.process || function() { return 'empty processing'; }; // ToDo add processing types
            return files.map((file) => {
                return process({file, analysis, analyzeFn, db});
            });
        });
        return Promise.all(processing);
    } catch(err) {
        console.error('ToDo - must handle this better'); // ToDo
        console.dir(err);
        throw err;
    }
};

/**
 * Processes a file to the data store
 * @param  {object} opts {
 *     file: {?},
 *     analyzeFn: {function},
 *     db: PouchAdapter
 * }
 * @return {promise} resolves to the document added
 */
const process = async (opts) => {
    const file = opts.file;
    const db = opts.db;
    const analysis = opts.analysis;
    let existing;
    let result;
    try {
        if (!opts.file.sha) {
            throw new Error('file should have been "sha"d at import time');
        }
        // ToDo get search to work
        // existing = await db.query({
        //     selector: {sha: file.sha},
        //     fields: ['sha']
        // });
    } catch (err) {
        debugger;
    }
    result = opts.analyzeFn(file.sha); // ToDo - actually process file content
    return db.add({data: result, label: analysis.label});
}

export default run;
