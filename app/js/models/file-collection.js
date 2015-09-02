'use strict';
var Collection = require('ampersand-collection');
var File = require('./file');

module.exports = Collection.extend({
    model: File,
    indexes: ['sha']
});
