module.exports = {
  apps: [{
    name: 'Events254',
    script: 'bin/www',
    watch: false,
    exec_mode: 'cluster',
    instances: 1
  }
  ]
}
