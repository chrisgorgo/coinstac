'use strict';
module.exports = function(grunt) {
    // watchify issue: https://github.com/substack/factor-bundle/issues/63
    grunt.registerTask('compile', 'compile coinstac', function() {
        grunt.task.run(['download']);
    });
};
