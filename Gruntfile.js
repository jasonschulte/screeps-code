const path = require('path')

module.exports = function(grunt){
  grunt.loadNpmTasks('grunt-screeps')
  grunt.loadNpmTasks('grunt-shell')
  grunt.loadNpmTasks('grunt-file-append')
  grunt.loadNpmTasks('grunt-contrib-copy')

  data = require('./private.json')

  var currentdate = new Date()

  grunt.initConfig({
    screeps: {
      options: {
        server: data.server,
        email: data.email,
        password: data.password,
        branch: data.branch,
        ptr: false
      },
      dist: {
        src: ['dist/*.js']
      }
    },
    shell: {
      webpack: path.join('.', 'node_modules', '.bin', 'webpack'),
      typescript: path.join('.', 'node_modules', '.bin', 'tsc'),
      mocha: path.join('.', 'node_modules', '.bin', 'mocha') + ' -r ts-node/register -c tests/*.spec.ts'
    },
    file_append: {
      versioning: {
        files: [
          {
            prepend: "\nmodule.exports = "+ currentdate.getTime() + "\n",
            input: 'lib/version.js',
            output: 'dist/version.js'
          }
        ]
      }
    },
    copy: {
      vendor: {
        files: [
          {expand: true, src: '*.js', dest: 'lib/vendor/', filter: 'isFile', 'cwd': 'arcos/vendor'}
        ]
      }
    }
  })

  grunt.registerTask('test', ['shell:typescript', 'shell:mocha'])
}
