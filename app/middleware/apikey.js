import { DB } from 'mevn-orm'

export default () => {
	return async (req, res, next) => {
		const apiKey = req.headers['x-api-key']
		if (!apiKey) {
			return res.status(400).json({
				status: '400',
				message: 'Missing Authorization header'
			})
		}

        
		try {
			const key = await DB('api_keys').where({
				key: apiKey
			}).first()

			if (!key) {
				return res.status(401).json({
					status: '401',
					message: 'Invalid API key'
				})
			}

			return next()
		} catch (e) {
			return next(e)
		}
	}
}