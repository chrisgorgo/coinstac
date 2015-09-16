module.exports = function(grunt) {
    return {
        test: {
            command: function() {
                return 'node test/index.js';
            }
        }
    };
};
