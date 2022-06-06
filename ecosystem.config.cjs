module.exports = {
	apps: [{
		name: 'api.events254.co.ke',
		script: 'npm',
		args: '-- run start',
		watch: false,
		exec_mode: 'cluster',
		instances: 1,
		ignore_watch: ['node_modules', 'logs', 'public', 'uploads'],
	}
	]
}
