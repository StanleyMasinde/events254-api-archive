import redis from 'redis'

const redisClient = redis.createClient()

export const cache  = (duration = 5) => {
	duration *= 60

	return (req, res, next) => {
		const { originalUrl } = req
		const { method } = req
		const url = originalUrl

		redisClient.get(`${method}:${url}`, (err, data) => {
			if (err) {
				next(err)
			}

			if (data) {
				res.header('Cache-Control', `public, max-age=${duration}`)
				res.header('Expires', new Date(Date.now() + duration * 1000).toUTCString())
				res.header('Last-Modified', new Date(Date.now() - duration * 1000).toUTCString())
				res.header('Vary', 'Accept-Encoding')
				return res.json(JSON.parse(data))
			} else {
				res.sendResponse = res.send
				res.send = (body) => {
					redisClient.set(`${method}:${url}`, body, 'EX', duration)
					res.sendResponse(body)
				}
				next()
			}
		})
	}
}
