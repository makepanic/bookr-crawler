module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        neuter: {
            options: {
                template: '{%= src %}'
            },
            application: {
                src: 'src/bootstrap.js',
                dest: 'dist/<%= pkg.name %>.neuter.js'
            }
        },

        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['src/intro.js', 'dist/<%= pkg.name %>.neuter.js', 'src/outro.js'],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },

        watch: {
            scripts: {
                files: ['src/**/*.js'],
                tasks: ['neuter', 'concat'],
                options: {
                    spawn: false
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-neuter');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');

    // Default task(s).
    grunt.registerTask('default', ['neuter', 'concat']);
    grunt.registerTask('dev', ['neuter', 'concat', 'watch']);

};