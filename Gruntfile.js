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
          sourceMap: true,
          sourceRoot: '',
          join: true
        },
        files: [{
          cwd: '<%= config.src %>',
          src: '**/*.coffee',
          dest: '<%= config.dist %>',
          ext: 'js'
        }]
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
