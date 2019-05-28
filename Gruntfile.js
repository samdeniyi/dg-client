module.exports = function(grunt) {
  grunt.initConfig({
    sass: {
      options: {
        includePaths: ['node_modules/bootstrap-sass/assets/stylesheets']
      },
      dist: {
        options: {
          outputStyle: 'compressed'
        },
        files: [
          {
            'src/assets/css/main.css': 'src/assets/scss/main.scss' /* 'All main SCSS' */,
            'src/assets/css/color_skins.css': 'src/assets/scss/color_skins.scss' /* 'All Color Option' */,
            'src/assets/css/inbox.css': 'src/assets/scss/pages/inbox.scss' /* 'Inbox App SCSS to CSS' */,
            'src/assets/css/blog.css': 'src/assets/scss/pages/blog.scss' /* 'Blog Pages SCSS to CSS' */,
            'src/assets/css/ecommerce.css': 'src/assets/scss/pages/ecommerce.scss' /* 'ecommerce SCSS to CSS' */
          }
        ]
      }
    }
  });
  grunt.loadNpmTasks('grunt-sass');

  grunt.registerTask('buildcss', ['sass']);
};
