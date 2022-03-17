import express from 'express'
import categoryController from '../app/controllers/categoryController.js'
const router = express.Router()

router
	.get('/', categoryController.all)
	.get('/:id', categoryController.show)
	.post('/', categoryController.create)
	.put('/:id', categoryController.update)
	.delete('/:id', categoryController.delete)

export default router
