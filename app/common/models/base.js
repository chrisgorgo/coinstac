/**
 * @package base.js - COINSTAC Model Extension
 * using es5 for server compatibility (not that it has to run on the server, but we run `node file.js` to debug and test)
 */
'use strict';
var Model = require('ampersand-model');
module.exports = Model.extend({
    initialize: function(attrs) {
        for (var def in this._definition) {
            var defDfl = this._definition[def].default;
            if (this._definition[def].required &&
                !this._derived[def] &&
                (!defDfl || (typeof defDfl === 'function' && !defDfl())) &&
                (attrs[def] === undefined || attrs[def] === null)) {
                throw new ReferenceError('expected value for attr `' + def + '`. received ' + attrs[def]);
            }
        }
        Model.prototype.initialize.apply(this, arguments);
    }
});
