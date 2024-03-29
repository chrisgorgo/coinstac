'use strict';
module.exports = function (grunt) {
    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);
    require('load-grunt-config')(grunt);
    require('./grunt/download.js')(grunt);
    require('./grunt/compile.js')(grunt);

    // By default, lint and run all tests.
    grunt.registerTask('test', ['shell:test']);
    grunt.registerTask('lint', ['jshint', 'jscs']);
    grunt.registerTask('default', ['lint', 'test']);
};
