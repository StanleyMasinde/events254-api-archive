import { DB } from 'mevn-orm'
import {randomBytes} from 'crypto'

(async () => {
	try {
		await DB('api_keys').insert({
			key: randomBytes(32).toString('base64'),
			app_name: 'Web App',
			app_description: 'Web App',
		})

		await DB('api_keys').insert({
			key: randomBytes(32).toString('base64'),
			app_name: 'Mobile App',
			app_description: 'Mobile App',
		})
	} catch (error) {
		console.log(error)
	}

	process.exit(0)
})()
