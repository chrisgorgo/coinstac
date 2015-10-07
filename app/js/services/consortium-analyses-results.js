/**
 * Consortium analyses results.
 *
 * Helpers for retrieving a consortium's analyses results and listening for
 * their changes. Relies on the PouchDB changes API proxied through Pouchy.
 *
 * @{@link  http://pouchdb.com/api.html#example-usage-8}
 * @{@link  http://pouchdb.com/api.html#example-response-7}
 *
 * @example <caption>Get an analyses results listener</caption>
 * getListener('my-consortium-id')
 *     .addListener('change', function(change) {
 *         // Respond to document changes
 *     })
 *     .addListener('delete', function(change) {
 *         // Respond to document deletion
 *     })
 *     .addListener('done', function(info) {
 *         // Respond to cancellation of change listener
 *     })
 *     .addListener('error', function(error) {
 *         // Handle db errors
 *     });
 *
 * Make sure to remove event listeners when they're no longer needed (i.e. when
 * your component un-mounts). It's useful to store references to your listeners
 * and call `EventEmitter`'s `removeListener` method on them:
 *
 * @example <caption>Remove analyses results listeners</caption>
 * getListener('my-consortium-id')
 *     .removeListener('change', myChangeListener)
 *     .removeListener('delete', myDeleteListener);
 *
 * Delete all analyses change listeners entirely. This isn't usually necessary.
 *
 * @todo  Consider renaming this function to make its effect more apparent
 *
 * @example <caption>Remove an analyses results listener</caption>
 * deleteListener('my-consortium-id');
 */

import config from 'config';
import EventEmitter from 'events';

import dbs from './db-registry';

/**
 * Local store for `ConsortiumAnalysesResults` objects.
 *
 * @type {map}
 * @private
 */
const store = new Map();

function getDb(consortiumId) {
    const slug = consortiumId.replace(/_/g, '-');

    /** @todo  Move database URL to a common configuration file */
    return dbs.get(
        config.db.remote.url + '/' +
        (config.db.remote.pathname ? config.db.remote.pathname + '/': '') +
        'consortium-' + slug
    );
}

/**
 * Creates a new consortium analyses results emitter.
 *
 * This class is intended as 'private': instances should only be created and
 * destroyed through the module's `getListener` and `deleteListener` function,
 * respectively. However, `getListener` exposes instances of the class for easy
 * event listening.
 *
 * @class
 */
class ConsortiumAnalysesResults extends EventEmitter {
    /**
     * Constructor.
     *
     * @param  {string} consortiumId
     * @return {object}
     */
    constructor(consortiumId) {
        super(consortiumId);

        this.pouchy = getDb(consortiumId);

        // Wire up events
        this._listeners = this.pouchy.db
            .changes({
                since: 'now',
                live: true,
                include_docs: true,
            })
            .on('change', change => {
                if (change.deleted) {
                    this.emit('delete', change);
                } else {
                    this.emit('change', change);
                }
            })
            .on('complete', info => this.emit('done', info))
            .on('error', error => this.emit('error', error));
    }

    /**
     * Remove event listeners and destroy object
     *
     * @return {undefined}
     */
    destroy() {
        this._listeners.cancel();
        this.removeAllListeners();
        delete this.pouchy;
        delete this._listeners;
    }
};

/**
 * Get consortium's analyses results listener.
 *
 * Retrieves a `ConsortiumAnalysesResults` emitter if it exists. Creates and
 * stores it if it doesn't exist.
 *
 * @param  {string} consortiumId
 * @return {object}              Instance of `ConsortiumAnalysesResults`
 */
function getListener(consortiumId) {
    if (!store.has(consortiumId)) {
        store.set(
            consortiumId,
            new ConsortiumAnalysesResults(consortiumId)
        );
    }

    return store.get(consortiumId);
}

/**
 * Delete consortium's analysis results.
 *
 * @param  {string}    consortiumId
 * @return {undefined}
 */
function deleteListener(consortiumId) {
    if (store.has(consortiumId)) {
        store.get(consortiumId).destroy();
        store.delete(consortiumId);
    }
}

function getResults(consortiumId) {
    return getDb(consortiumId).all();
}

export { getListener, deleteListener, getResults };
