import _ from 'lodash';
import config from 'config';
import url from 'url';

import dbs from './db-registry';
import User from './user';

/**
 * @todo  Figure out a more convenient way to get the consortia store.
 */
const consortia = dbs.get(url.format({
    hostname: config.db.remote.hostname,
    pathname: (config.db.remote.pathname ? config.db.remote.pathname + '/' : '') + 'consortiameta',
    port: config.db.remote.port,
    protocol: config.db.remote.protocol,
}));

const KEYS = {
    ANALYSES: 'analyses',
    DESCRIPTION: 'description',
    LABEL: 'label',
    RESULTS: 'results',
    TAGS: 'tags',
    USERS: 'users',
};

/**
 * Single response factory.
 *
 * @return {Promise}
 */
function singleResponseFactory({ consortiumId, key, value }) {
    return new Promise((resolve, reject) => {
        consortium.get(consortiumId)
            .then(consortium => {
                consortium[key] = value;
                consortia
                    .save(consortium)
                    .then(() => resolve({ [key]: value }))
                    .catch(reject);
            })
            .catch(reject)
    });
}

/**
 * Collection response factory.
 *
 * @return {Promise}
 */
function collectionResponseFactory({
    consortiumId,
    key,
    mode,
    newValue,
    value,
}) {
    return new Promise((resolve, reject) => {
        /**
         * @todo  Come up with a more intelligent `compareKey` system.
         */
        const compareKey = (key === KEYS.USERS) ? 'username' : 'id';

        /**
         * @todo  Come up with a better comparator.
         */
        function valueFilter(x) {
            if (_.isObject(value) && _.isObject(x)) {
                return x[compareKey] === value[compareKey];
            }
            return x === value;
        }

        consortium.get(consortiumId)
            .then(consortium => {
                const valueExists = consortium[key].some(valueFilter);
                const oldValues = consortium[key];
                let isChanged = false;

                if (mode === collectionResponseFactory.EDIT && valueExists) {
                    consortium[key] = consortium.key.map(x => {
                        if (valueFilter(x)) {
                            return newValue;
                        }
                        return x;
                    });
                } else if (
                    mode === collectionResponseFactory.REMOVE &&
                    valueExists
                ) {
                    consortium[key] = consortium[key].filter(
                        _.negate(valueFilter)
                    );
                } else if (!valueExists && value) {
                    // Add the value
                    consortium[key] = [...consortium[key], value];
                }

                // Check for changes by comparing the key's value
                if (consortium[key] !== oldValues) {
                    consortia
                        .save(consortium)
                        .then(() => resolve(value))
                        .catch(reject);
                } else {
                    resolve();
                }
            })
            .catch(reject)
    });
}
collectionResponseFactory.ADD = Symbol('Add consortium value');
collectionResponseFactory.EDIT = Symbol('Edit consortium value');
collectionResponseFactory.REMOVE = Symbol('Remove consortium value');

/**
 * Validate an analysis.
 *
 * @todo  Validate `analysis.id` as unique. Define the analysis 'model'.
 *
 * @param  {number|string} consortiumId
 * @param  {object}        analysis
 * @param  {string}        analysis.label
 * @return {Promise}
 */
export function validateAnalysis(consortiumId, { label }) {
    return new Promise((resolve, reject) => {
        if (label.length < 5) {
            throw new Error('Label must have at least 5 characters');
        }

        consortium.get(consortiumId)
            .then(consortium => {
                const isValid = !consortium.analyses.some(x => {
                    return x.label === label
                });

                if (isValid) {
                    resolve();
                } else {
                    throw new Error(`Analysis label “${label}” already exists`);
                }
            })
            .catch(reject);
    });
}

const consortium = {
    /**
     * Get consortium by ID.
     *
     * @param  {number|string} id Consortium's id
     * @return {Promise}
     */
    get(id) {
        return consortia.get(id);
    },

    /**
     * Add a user to a consortium.
     *
     * @param  {number|string} consortiumId
     * @param  {number|string} userId
     * @return {Promise}
     */
    addUser(consortiumId, username) {
        return collectionResponseFactory({
            consortiumId,
            key: KEYS.USERS,
            value: { username },
        });
    },

    /**
     * Remove a user from a consortium.
     *
     * @param  {number|string} consortiumId
     * @param  {number|string} userId
     * @return {Promise}
     */
    removeUser(consortiumId, username) {
        return collectionResponseFactory({
            consortiumId,
            key: KEYS.USERS,
            mode: collectionResponseFactory.REMOVE,
            value: { username },
        });
    },

    /**
     * Edit a consortium's label.
     *
     * @param  {number|string} consortiumId
     * @param  {string}        label        Label's updated value
     * @return {Promise}
     */
    editLabel(consortiumId, label) {
        return ConsortiumResponseFactory({
            consortiumId,
            key: KEYS.LABEL,
            value: label,
        });
    },

    /**
     * Edit a consortium's description.
     *
     * @param  {number|string} consortiumId
     * @param  {string}        description  Description's updated value
     * @return {Promise}
     */
    editDescription(consortiumId, description) {
        return ConsortiumResponseFactory({
            consortiumId,
            key: KEYS.DESCRIPTION,
            value: description,
        });
    },

    /**
     * Add a tag to a consortium.
     *
     * @param  {number|string} consortiumId
     * @param  {object}        tag
     * @return {Promise}
     */
    addTag(consortiumId, tag) {
        return collectionResponseFactory({
            consortiumId,
            key: KEYS.TAGS,
            value: tag,
        });
    },

    /**
     * Edit a consortium's tag.
     *
     * @param  {number|string} consortiumId
     * @param  {number|string} tagId        Tag's ID
     * @param  {string}        tag          Tag's new value
     * @return {Promise}
     */
    editTag(consortiumId, tagId, tag) {
        return collectionResponseFactory({
            consortiumId,
            key: KEYS.TAGS,
            mode: collectionResponseFactory.EDIT,
            newValue: tag,
            value: { id: tagId },
        });
    },

    /**
     * Remove a tag from a consortium.
     *
     * @param  {number|string} consortiumId
     * @param  {number|string} tagId
     * @return {Promise}
     */
    removeTag(consortiumId, tagId) {
        return collectionResponseFactory({
            consortiumId,
            key: KEYS.TAGS,
            mode: collectionResponseFactory.REMOVE,
            value: { id: tagId}
        });
    },

    /**
     * Add analysis to a consortium.
     *
     * @todo  Build analysis validation into this method.
     *
     * @param  {number|string} consortiumId
     * @param  {object}        analysis
     * @return {Promise}
     */
    addAnalysis(consortiumId, analysis) {
        return collectionResponseFactory({
            consortiumId,
            key: KEYS.ANALYSES,
            value: analysis,
        });
    },

    /**
     * Edit a consortium's analysis.
     *
     * @param  {number|string} consortiumId
     * @param  {number|string} analysisId
     * @param  {object}        analysis
     * @return {Promise}
     */
    editAnalysis(consortiumId, analysisId, analysis) {
        return collectionResponseFactory({
            consortiumId,
            key: KEYS.ANALYSES,
            mode: collectionResponseFactory.EDIT,
            newValue: analysis,
            value: { id: analysisId },
        });
    },

    /**
     * Remove analysis from a consortium.
     *
     * @param  {number|string} consortiumId
     * @param  {number|string} analysisId
     * @return {Promise}
     */
    removeAnalysis(consortiumId, analysisId) {
        return collectionResponseFactory({
            consortiumId,
            key: KEYS.ANALYSES,
            mode: collectionResponseFactory.REMOVE,
            value: { id: analysisId },
        });
    },

    /**
     * Add analysis result to a consortium.
     *
     * @param  {number|string} consortiumId
     * @param  {object}        result
     * @return {Promise}
     */
    addResult(consortiumId, result) {
        return collectionResponseFactory({
            consortiumId,
            key: KEYS.RESULTS,
            value: result,
        });
    },

    /**
     * Edit a consortia's analysis result.
     *
     * @param  {number|string} consortiumId
     * @param  {number|string} resultId
     * @param  {object}        result
     * @return {Promise}
     */
    editResult(consortiumId, resultId, result) {
        return collectionResponseFactory({
            consortiumId,
            key: KEYS.RESULTS,
            mode: collectionResponseFactory.EDIT,
            newValue: result,
            value: { id: resultId },
        });
    },

    /**
     * Remove an analysis result from a consortia.
     *
     * @param  {number|string} consortiumId
     * @param  {number|string} resultId
     * @return {Promise}
     */
    removeResult(consortiumId, resultId) {
        return collectionResponseFactory({
            consortiumId,
            mode: collectionResponseFactory.REMOVE,
            value: { id: resultId },
        });
    },
};

export default consortium;
