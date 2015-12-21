import config from 'config';
import EventEmitter from 'events';
import memdown from 'memdown';
import Pouchy from 'pouchy';
import test from 'tape';
import path from 'path';

var dbs = require(path.resolve(process.cwd(), 'app/render/services/db-registry'));
var analysisResults = require(path.resolve(process.cwd(), 'app/render/services/consortium-analyses-results'));
let { getListener, deleteListener, getResults } = analysisResults;

// Do a little setup
const consortiumId = 'consortium-bla-bla-bla';
const documents = [{
    _id: 'doc1',
    aggregate: false,
    data: { 'Data': 0 },
    error: null,
    files: ['one', 'two', 'three'],
}, {
    _id: 'doc2',
    aggregate: true,
    data: { 'Data': 1 },
    error: null,
    files: ['four', 'five', 'six'],
}, {
    _id: 'doc3',
    aggregate: true,
    data: { 'Data': 2 },
    error: null,
    files: ['seven'],
}];
const mockDbsGet = name => {
    const slug = name.replace(/_/g, '-');

    if (slug.indexOf(consortiumId) !== -1) {
        return database; // Defined in setup
    } else {
        throw new Error(`dbs.get request for unknown “${name}”`);
    }
};

let database;
let dbsGetRef;
let resultsEmitter;

test('test setup', t => {
    t.plan(documents.length * 2 + 1);

    database = new Pouchy({
        name: consortiumId,
        pouchConfig: {
            db: memdown,
        },
    });

    // Seed the test database
    database.bulkDocs(documents)
        .then(results => {
            results.forEach((result, index) => {
                t.ok(result.ok, 'doc okay');
                t.equals(result.id, documents[index]._id, 'id matches');
            });
        })
        .catch(t.error);

    /**
     * Hijack the registry to allow for in-memory PouchDB.
     *
     * @todo  Figure out a more elegant solution. This duplicates some of the
     *        tested module's functionality.
     */
    dbsGetRef = dbs.get;
    dbs.get = mockDbsGet;
    t.equals(dbs.get, mockDbsGet, 'mock dbs.get');
});

test('result listner is an EventEmitter', t => {
    resultsEmitter = getListener(consortiumId);

    t.ok(resultsEmitter instanceof EventEmitter);
    t.end();
});


test('result listener emits change events', t => {
    const maxCount = 3;
    let count = 0;

    t.plan(maxCount);

    /**
     * Set up listener.
     *
     * Dequeue listener via itself. This is necessary because Pouch's `change`
     * events appear debounced when the database is in local memory. Calling
     * `resultsEmitter.removeAllListeners()` in a `then` removes the listener
     * before it has fired.
     */
    resultsEmitter.on('change', function(change) {
        t.ok(change, 'has change object');
        count++;
        if (count >= maxCount - 1) {
            t.ok(resultsEmitter.removeAllListeners());
        }
    });

    // Make some changes
    database.all()
        .then(docs => {
            // Modify a document
            const doc = docs[0];

            doc.aggregate = true;
            doc.error = 'Sample error message';

            return database.save(doc);
        })
        .then(() => {
            return database.save({
                aggregate: false,
                data: null,
                error: null,
                files: ['eight'],
            });
        })
        .catch(t.error);
});

test('result listener emits delete events', t => {
    t.plan(3);

    // Set up listener
    resultsEmitter.on('delete', function(change) {
        t.ok(change, 'has change object');
        t.ok('deleted' in change, 'has delete object');
        t.ok(resultsEmitter.removeAllListeners());
    });

    database.all()
        .then(docs => {
            // Delete a document
            const doc = docs[docs.length - 1];

            return database.delete(doc);
        })
        .catch(t.error);
});

test('result listerener can be destroy-able', t => {
    deleteListener(consortiumId);

    t.notOk('_listeners' in resultsEmitter, 'Listeners removed');
    t.notOk('pouchy' in resultsEmitter, 'Pouchy reference removed');
    t.end();
});

// Test teardown
test('test tear-down', t => {
    t.plan(2);

    t.ok(dbs.get = dbsGetRef);
    database.destroy()
        .then(response => {
            t.ok(response.ok, 'database destroyed');
        })
        .catch(t.error);
});
