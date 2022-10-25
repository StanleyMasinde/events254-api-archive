import { Router } from 'express'
import multer from 'multer'
import upload from '../app/filesystem/s3.js'

const router = Router()

router


// Upload file to S3 and retur its URL
	.post('/', multer({ dest: './uploads' }).single('file'), async (req, res, next) => {
		const { file } = req

		try {
			const fileURL = await upload(file, 'event-posters') // TODO: uploadlocations?
			return res.json({ fileURL })
		} catch (err) {
			next(err)
		}
	})

export default router