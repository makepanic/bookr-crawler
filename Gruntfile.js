module.exports = function (grunt) {

    var bookrConfig = {
        test: 'tests',
        dist: 'dist',
        src: 'src'
    };

    // Project configuration.
    grunt.initConfig({
        bookr: bookrConfig,
        pkg: grunt.file.readJSON('package.json'),

        neuter: {
            options: {
                template: '{%= src %}'
            },
            application: {
                src: '<%= bookr.src %>/bootstrap.js',
                dest: '<%= bookr.dist %>/<%= pkg.name %>.neuter.js'
            }
        },

        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['<%= bookr.src %>/intro.js', '<%= bookr.dist %>/<%= pkg.name %>.neuter.js', '<%= bookr.src %>/outro.js'],
                dest: '<%= bookr.dist %>/<%= pkg.name %>.js'
            }
        },

        watch: {
            scripts: {
                files: ['<%= bookr.src %>/**/*.js'],
                tasks: ['neuter', 'concat'],
                options: {
                    spawn: false
                }
            }
        },

        // @see https://github.com/caolan/nodeunit
        nodeunit: {
            all: ['<%= bookr.test %>/**/*.test.js']
        },

        eslint: {
            target: [
                '<%= bookr.src %>/**/*.js',
                '!<%= bookr.src%>/intro.js',
                '!<%= bookr.src%>/outro.js',
                '!<%= bookr.src %>/bootstrap.js'
            ],
            options: {
                config: 'eslint.json'
            }
        }
    });

    grunt.loadNpmTasks('grunt-neuter');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-eslint');

    // Default task(s).
    grunt.registerTask('default', ['eslint', 'neuter', 'concat']);
    grunt.registerTask('dev', ['neuter', 'concat', 'watch']);
    grunt.registerTask('test', ['eslint', 'neuter', 'concat', 'nodeunit']);

};