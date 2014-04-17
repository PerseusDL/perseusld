module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/js/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js'
      },
     },
     bower: {
          install: {
              options: {
                  targetDir : "src/js/lib"
              }
          }
      }
  }) ;
  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-bower-task');

  // Default task(s).
  grunt.registerTask('default', ['bower']);
};
