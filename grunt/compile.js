'use strict';
module.exports = function(grunt) {
    grunt.registerTask('compile', 'compile coinstac', function() {
        grunt.task.run(['download']);
    });
};
