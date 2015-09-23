var _ = require('lodash');
var Model = require('ampersand-model');
var PouchDocument = require('./pouch-document'); // &-Model with _id & _rev props
var isoDateMixin = require('ampersand-state-mixin-datatype-iso-date');
var md5 = require('md5');

var Analysis = PouchDocument.extend(isoDateMixin, {
    props: {
        // _id & _rev specified from PouchDocument
        consortiumId: {
            type: 'string',
            required: true,
            allowNull: false
        },
        fileSha: {
            type: 'string',
            required: true,
            allowNull: false
        },
        complete: {
            // forces dates in ISO 8601 long string
            type: 'iso-date',
            required: true,
            allowNull: false
        },
        result: {
            type: 'array',
            required: true,
            allowNull: false
        },
        username: {
            type: 'string',
            required: true,
            allowNull: false
        },
    },
    derived: {
        _id: {
            // id should be a unique value representing this file in this consoritum
            deps: ['fileSha', 'consortiumId'],
            fn: function() {
                return md5(this.fileSha + this.consortiumId)
            },
            squash: true,
            cache: false // remove post https://github.com/AmpersandJS/ampersand-state/pull/196 closure
        }
    },
    /**
     * Extend serialize to get derived attrs on the cloned obj
    **/
    serialize: function() {
        return Model.prototype.serialize.call(this, {derived: true});
    }
});

module.exports = Analysis;
