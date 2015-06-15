var less_clean_css = require('less-plugin-clean-css'),
    less_clean_css_plugin = new less_clean_css({keepSpecialComments: 1, processImport: true}),
    path = require('path');

module.exports = function (grunt) {

  grunt.initConfig({
    clean: ['dist/<%= pkg.name %>.concat.js'],
    concat: {
      dist: {
        src: [
          path.join('src', 'js', 'app.js'),
          path.join('src', 'js', 'app-controllers.js'),
          path.join('src', 'js', 'app-services.js')
        ],
        dest: path.join('dist', '<%= pkg.name %>.concat.js')
      }
    },
    copy: {
      main: {
        files: [
          {expand: true, cwd: path.join('src', 'html'), src: ['**'], dest: 'dist/'},
          {expand: true, cwd: path.join('src', 'json'), src: ['*.json'], dest: 'dist/'}
        ]
      }
    },
    'json-minify': {
      build: {
        files: path.join('dist', '*.json')
      }
    },
    less: {
      production: {
        options: {
          paths: [path.join('src', 'less')],
          plugins: [less_clean_css_plugin]
        },
        files: {
          'dist/<%= pkg.name %>.min.css': [path.join('src', 'less', 'main.less')]
        }
      }
    },
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        compress: true,
        preserveComments: 'some'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-json-minify');

  grunt.registerTask('default', ['copy', 'less', 'json-minify', 'concat', 'uglify', 'clean']);

};