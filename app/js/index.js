'use strict';
var test = require('./test');

module.exports = window.go = function() {
    window.test = test;
};

window.go();
