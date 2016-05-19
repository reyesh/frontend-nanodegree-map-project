module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({

        jshint: {
          files: {
            src: ['Gruntfile.js','src/js/app.js']
          }
        },
        uglify: {
      			build: {
      				src: 'src/js/app.js',
      				dest: 'src/js/app.min.js'
      			}
	     	}, 
		    cssmin:{
           dist: {
              options: {
                 banner: ''
              },
              files: {
                 'src/css/style.min.css': ['src/css/style.css']
              }
          }
        },
        processhtml: {
          options: {
            data: {
              message: 'Hello world!'
            }
          },
          dist: {
            files: {
              'dest/index.html': ['src/index.html']
            }
          }
        } 
               
	});


    grunt.registerTask('default', ['jshint','uglify','cssmin','processhtml']);
};