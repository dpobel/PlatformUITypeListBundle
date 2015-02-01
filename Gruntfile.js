module.exports = function(grunt) {
    var reportDir = "./Tests/report",
        instrumentDir = "./Tests/instrument",
        sourceFiles = [
            "./Resources/public/js/apps/plugins/*.js",
            "./Resources/public/js/views/*.js",
        ],
        testFiles = [
            "./Tests/js/**/*.js",
        ];

    grunt.initConfig({
        jshint: {
            options: {
                jshintrc: 'jshint.json'
            },
            all: [sourceFiles, testFiles]
        },
        instrument: {
            files : sourceFiles,
            options : {
                basePath : instrumentDir
            }
        },
        pkg: grunt.file.readJSON('package.json'),
        shell: {
            grover: {
                command: 'grover --server -o "' + reportDir + '/junit.xml" --junit Tests/js/*/*/*.html',
                options: {
                    stdout: true,
                    stderr: true,
                    failOnError: true,
                }
            },
            groverCoverage: {
                command: 'grover --server --coverage --coverdir "' + reportDir + '" -S "?filter=coverage" Tests/js/*/*/*.html',
                options: {
                    stdout: true,
                    stderr: true,
                    failOnError: true,
                }
            },
        },
        watch: {
            options: {
                atBegin: true
            },
            test: {
                files: [sourceFiles, testFiles, "Tests/js/**/*.html"],
                tasks: ["shell:grover"]
            },
        },
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-istanbul');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('lint', ['jshint']);
    grunt.registerTask('test', ['jshint', 'shell:grover'] );
    grunt.registerTask('coverage', ['jshint', 'instrument', 'shell:groverCoverage'] );
};
