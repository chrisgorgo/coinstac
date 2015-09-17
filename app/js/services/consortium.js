import _ from 'lodash';

import dbs from './db-registry';
import User from './user';

const consortia = dbs.get('consortiameta');

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
function SingleResponseFactory({ consortiumId, key, value }) {
    return new Promise((resolve, reject) => {
        Consortium.get(consortiumId)
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
function CollectionResponseFactory({
    consortiumId,
    key,
    mode,
    newValue,
    value,
}) {
    return new Promise((resolve, reject) => {
        /**
         * @todo  Come up with a better comparator.
         */
        function valueFilter(x) {
            if (_.isObject(value) && _.isObject(x)) {
                return x.id === value.id;
            }
            return x === value;
        }

        Consortium.get(consortiumId)
            .then(consortium => {
                const valueExists = consortium[key].some(valueFilter);
                const oldValues = consortium[key];
                let isChanged = false;

                if (mode === CollectionResponseFactory.EDIT && valueExists) {
                    consortium[key] = consortium.key.map(x => {
                        if (valueFilter(x)) {
                            return newValue;
                        }
                        return x;
                    });
                } else if (
                    mode === CollectionResponseFactory.REMOVE &&
                    valueExists
                ) {
                    consortium[key] = consortium.key.filter(
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
CollectionResponseFactory.EDIT = Symbol('Edit consortium value')
CollectionResponseFactory.REMOVE = Symbol('Remove consortium value');

const Consortium = {
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
     * Get all consortia.
     *
     * @return {Promise}
     */
    all() {
        return consortia.all();
    },

    /**
     * Add a user to a consortium
     *
     * @todo  Consider unifying this method's API with the others (i.e. pass in
     *        a user object instead of ID.)
     *
     * @param  {number|string} consortiumId
     * @param  {number|string} userId
     * @return {Promise}
     */
    addUser(consortiumId, userId) {
        return new Promise((resolve, reject) => {
            Promise.all([
                Consortium.get(consoritumId),
                User.get(userId),
            ]).then(consortium, user => {
                const hasUser = consortium[KEYS.USERS].some(x => x.id === userId);
                const resolver = () => resolve({ consortium, user });

                if (!hasUser) {
                    consortium.users = [...consortium.users, user];
                    consortia.save(consortium).then(resolver).catch(reject);
                } else {
                    resolver();
                }
            }).catch(reject);
        });
    },

    /**
     * Remove a user from a consortium.
     *
     * @param  {number|string} consortiumId
     * @param  {number|string} userId
     * @return {Promise}
     */
    removeUser(consortiumId, userId) {
        return CollectionResponseFactory({
            consortiumId,
            key: KEYS.USERS,
            mode: CollectionResponseFactory.REMOVE,
            value: { id: userId },
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
        return CollectionResponseFactory({
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
        return CollectionResponseFactory({
            consortiumId,
            key: KEYS.TAGS,
            mode: CollectionResponseFactory.EDIT,
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
        return CollectionResponseFactory({
            consortiumId,
            key: KEYS.TAGS,
            mode: CollectionResponseFactory.REMOVE,
            value: { id: tagId}
        });
    },

    /**
     * Add analysis to a consortium.
     *
     * @param  {number|string} consortiumId
     * @param  {object}        analysis
     * @return {Promise}
     */
    addAnalysis(consortiumId, analysis) {
        return ConsortiumCollectionReponseFactory({
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
        return CollectionResponseFactory({
            consortiumId,
            key: KEYS.ANALYSES,
            mode: CollectionResponseFactory.EDIT,
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
        return CollectionResponseFactory({
            consortiumId,
            key: KEYS.ANALYSES,
            mode: CollectionResponseFactory.REMOVE,
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
        return CollectionResponseFactory({
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
        return CollectionResponseFactory({
            consortiumId,
            key: KEYS.RESULTS,
            mode: CollectionResponseFactory.EDIT,
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
        return CollectionResponseFactory({
            consortiumId,
            mode: CollectionResponseFactory.REMOVE,
            value: { id: resultId },
        });
    },
};

export default Consortium;
