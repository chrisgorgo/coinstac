'use strict';
var Model = require('ampersand-model');
var config = require('config');
var path = require('path');

module.exports = Model.extend({
    apiRoot: config.api.url,
    idAttribute: 'path',
    props: {
        filename: {
            type: 'string',
            required: true,
            allowNull: false
        },
        dirname: {
            type: 'string',
            required: true,
            allowNull: false
        },
        sha: {
            type: 'string',
            required: true,
            allowNull: false
        },
        tags: {
            type: 'object',
            required: true,
            default: function() {
                return {
                    control: false
                };
            }
        }
    },
    derived: {
        path: {
            deps: ['filename', 'dirname'],
            fn: function() {
                return path.join(this.dirname, this.filename);
            }
        }
    }
});
