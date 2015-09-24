'use strict';
var Model = require('./base.js');
module.exports = Model.extend({
    idAttribute: '_id',
    props: {
        _id: {
            type: 'string',
            required: true
        },
        _rev: {
            type: 'string',
            required: false
        },
    }
});
