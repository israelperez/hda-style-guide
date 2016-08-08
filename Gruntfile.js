module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    site: {
      jsDev: 'scripts/{,**/*}*.js',
      jsDist: 'js/main.js',
      jsDistFolder: 'js/*',
      sass: 'scss/{,**/*}*.scss',
      cssDev: 'scss/main.css',
      cssDist: 'css/main.css',
      cssDistFolder: 'css/*',
      port: 3000,
      server: 'localhost'
    },
    clean: {
      dist: [
        '<%= site.cssDistFolder %>', '<%= site.jsDistFolder %>'
      ]
    },

    compass: {
      options: {
        sassDir: 'scss',
        cssDir: 'css'
      },
      dev: {
        options: {
          debugInfo: true,
          sourcemap: true
        }
      },
      dist: {
        options: {
          environment: 'production'
        }
      }
    },
    postcss: {
      options: {
        processors: [
          require('autoprefixer')({browsers: 'last 2 versions'}) // add vendor prefixes
        ]
      },
      dev: {
        map: true,
        src: '<%= site.cssDist %>',
        dest: '<%= site.cssDist %>',
      },
      dist: {
        src: '<%= site.cssDist %>',
        dest: '<%= site.cssDist %>'
      }
    },
    cssmin: {
      dev: {
        sourceMap: true,
        src: '<%= site.cssDist %>',
        dest: '<%= site.cssDist %>'
      },
      dist: {
        src: '<%= site.cssDist %>',
        dest: '<%= site.cssDist %>'
      }
    },

    jshint: {
      options: {
        // environment options
        browser: true,
        jquery: true,
        node: true,
        // enforcing options
        bitwise: true,
        camelcase: true,
        curly: true,
        eqeqeq: true,
        latedef: true,
        strict: true,
        undef: true,
        unused: true,
        globals: {
          //variables to ignore
          google: true
        }
      },
      all: ['Gruntfile.js', '<%= site.jsDev %>']
    },
    concat: {
      dev: {
        options: {
          separator: '// concatenated' + grunt.util.linefeed,
          sourceMap: true
        },
        src: ['scripts/vendor/jquery.js', 'scripts/vendor/bootstrap.js', 'scripts/*.js'],
        dest: '<%= site.jsDist %>'
      },
      dist:{
        options: {
          sourceMap: false
        },
        src: '<%= site.jsDev %>',
        dest: '<%= site.jsDist %>'
      }
    },
    uglify: {
      options: {
        compress: true,
        mangle: false
      },
      dev: {
        sourceMap: true,
        files: {
          '<%= site.jsDist %>': ['<%= site.jsDist %>']
        }
      },
      dist: {
        sourceMap: false,
        files: {
          '<%= site.jsDist %>': ['<%= site.jsDist %>']
        }
      }
    },

    connect: {
      server: {
        options: {
          port: 3000,
          keepalive: true,
          base: '.',
          host: 'localhost',
          livereload: 35729,
          open: 'http://<%= site.server %>:<%= site.port %>'/*,
          middleware: function () {
            return [
              require('connect-livereload')() // add livereload script to the response
            ];
          }*/
        }
      }
    },
    watch:{
      options: {
        livereload: '<%= connect.server.options.livereload %>'
      },
      scripts: {
        files: ['<%= site.jsDev %>'],
        tasks: ['newer:jshint', 'concat:dev']//, 'uglify:dev'],
        /*options: {
          livereload: false
        }*/
      },
      styles: {
        files: ['<%= site.sass %>'],
        tasks: ['compass:dev', 'postcss:dev'],
        options: {
          livereload: false
        }
      },
      livereload: {
        files: [
          '{,**/*}*.html',
          'css/{,**/*}*.css',
          'img/{,**/*}*.{png,jpg,jpeg,gif,svg}'
        ]
      }
    },
    concurrent: {
      serve: {
        tasks: [
          'connect',
          'watch'
        ],
        options: {
          logConcurrentOutput: true
        }
      }
    }
  });

  // run task with newer src files
  grunt.loadNpmTasks('grunt-newer');
  // clear folders
  grunt.loadNpmTasks('grunt-contrib-clean');
  // compile CSS
  grunt.loadNpmTasks('grunt-contrib-compass');
  // auto prefix CSS
  grunt.loadNpmTasks('grunt-postcss');
  // minify CSS
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // detect errors and potential problems in JS
  grunt.loadNpmTasks('grunt-contrib-jshint');
  // concatenated files
  grunt.loadNpmTasks('grunt-contrib-concat');
  // minify JS
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // start grunt server
  grunt.loadNpmTasks('grunt-contrib-connect');
  // watch for changes and compile files
  grunt.loadNpmTasks('grunt-contrib-watch');
  // run tasks at the same time
  grunt.loadNpmTasks('grunt-concurrent');

  // default builds production version
  grunt.registerTask('default', [
    'clean', // remove all dev files and maps
    'compass:dist', //compile scss
    'postcss:dist', //add prefixes to CSS
    'cssmin:dist', // minify CSS
    'newer:jshint', // check js for problems
    'concat:dist', // combine files
    'uglify:dist', // minify js
    'connect', // Run server and open site
  ]);

  grunt.registerTask('serve',[
    'clean', // remove all files and maps,
    'compass:dev', //compile scss with debug info
    'postcss:dev', //add prefixes to css
    'cssmin:dev', // minify CSS but conflicts with sass sourceMap
    'newer:jshint',  // check js for problems
    'concat:dev', // combine files
    'uglify:dev', // minify js
    'concurrent' // Run server and open site and watch for changes
  ]);
};
