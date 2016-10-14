/*jshint node:true, laxbreak:true */
'use strict';

module.exports = function(grunt) {
  grunt.config.merge({
    jshint: {
      lintScripts: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: [
          'Gruntfile.js',
          '<%= env.DIR_SRC %>/assets/scripts/**/*.js'
        ]
      }
    }
  });

  grunt.registerTask('lintScripts', [
    'jshint:lintScripts'
  ]);
};
