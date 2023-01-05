import { createClient } from 'redis'

const client = createClient()
// client.on('error', (err) => {
// 	throw new Error({ cause: err })
// })

export const cache = (duration = 5) => {
	duration *= 60

	return async (req, res, next) => {
		try {
			const { originalUrl } = req
			const { method } = req
			const url = originalUrl

			await client.connect()
			const data = await client.get(`${method}:${url}`)
			if (data) {
				res.header('Cache-Control', `public, max-age=${duration}`)
				res.header('Expires', new Date(Date.now() + duration * 1000).toUTCString())
				res.header('Last-Modified', new Date(Date.now() - duration * 1000).toUTCString())
				res.header('Vary', 'Accept-Encoding')
				await client.disconnect()
				return res.json(JSON.parse(data))
			} else {
				res.sendResponse = res.send
				res.send = async (body) => {
					await client.set(`${method}:${url}`, body)
					res.sendResponse(body)
					await client.disconnect()
				}
				next()
			}
		} catch (er) {
			next(er)
		}
	}
}

/**
 * Clear the request cache
 * leave the session intact
 * @returns 
 */
export const clearCache = () => {
	return async (req, res, next) => {
		const { originalUrl } = req
		const { method } = req
		const url = originalUrl

		await client.connect()
		await client.del(`${method}:${url}`)
		await client.disconnect()
		next()
	}
}