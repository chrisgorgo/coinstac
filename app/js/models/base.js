'use strict';
var Model = require('ampersand-model');
module.exports = Model.extend({
    initialize: function(attrs) {
        for (var def in this._definition) {
            if (def === '_rev') {
                debugger;
            }
            var defDfl = this._definition[def].default;
            if (this._definition[def].required &&
                (!defDfl || (typeof defDfl === 'function' && !defDfl())) &&
                (attrs[def] === undefined || attrs[def] === null)) {
                throw new ReferenceError('expected value for attr `' + def + '`. received ' + attrs[def]);
            }
        }
        Model.prototype.initialize.apply(this, arguments);
    }
});
