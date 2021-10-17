module.exports = {
	apps: [{
		name: 'Events254',
		script: 'npm',
		args: '-- run start',
		watch: false,
		exec_mode: 'cluster',
		instances: 1,
		ignore_watch: ['node_modules', 'logs', 'public', 'uploads'],
	}
	]
}
