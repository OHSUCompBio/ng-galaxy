'use strict';

module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  var config = {
    src: 'src',
    dist: 'dist'
  };

  grunt.initConfig({

    config: config,

    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '<%= config.dist %>/{,*/}*'
          ]
        }]
      }
    },

    coffee: {
      dist: {
        options: {
          sourceMap: true
        },
        files: {
          '<%= config.dist %>/galaxy.js': '<%= config.src %>/**/*.coffee'
        }
      }
    },
  });


  grunt.registerTask('build', [
    'clean:dist',
    'coffee:dist'
  ]);

  grunt.registerTask('default', [
    'build'
  ]);
};
