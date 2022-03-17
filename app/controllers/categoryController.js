import Category from '../models/category.js'
import Controller from './controller.js'

class CategoryController extends Controller
{
	/**
     * Get all the categories in the database
     * 
     * @param {import('express').Request} req Express request object
     * @param {import('express').Response} res Express response object
     * @param {import('express').NextFunction} next Express next function
     * @returns {Promise<void>} Array of categories
     */
	async all(req, res, next) {
		try {
			const categories = await Category.all()
			return res.status(200).json(categories)
		} catch (error) {
			return next(error)
		}
	}

	/**
     * Get a category by it's database ID
     * 
     * @param {import('express').Request} req Express request object
     * @param {import('express').Response} res Express response object
     * @param {import('express').NextFunction} next Express next function
     * @returns {Promise<void>} Category
     */
	async show(req, res, next) {
		try {
			const category = await Category.find(req.params.category)
			if (!category) {
				return res.status(404).json({
					message: 'Category not found'
				})
			}
			res.json(category)
		} catch (error) {
			return next(error)
		}
	}

	/**
     * Create a new category
     * 
     * @param {import('express').Request} req Express request object
     * @param {import('express').Response} res Express response object
     * @param {import('express').NextFunction} next Express next function
     * @returns {Promise<void>} Category
     */
	async create(req, res, next) {
		const { body } = req
		try {
			const category = await Category.create(body)
			return res.status(201).json(category)
		} catch (error) {
			return next(error)
		}
	}


	/**
     * Update a category by it's database ID
     * 
     * @param {import('express').Request} req Express request object
     * @param {import('express').Response} res Express response object
     * @param {import('express').NextFunction} next Express next function
     * @returns {Promise<void>} Category
     */
	async update(req, res, next) {
		const { body } = req
		try {
			const category = await Category.find(req.params.id)
			if (!category) {
				return res.status(404).json({
					message: 'Category not found'
				})
			}
			const updatedCategory = await category.update(body)
			return res.status(200).json(updatedCategory)
		} catch (error) {
			return next(error)
		}
	}

	/**
     * 
     * @param {import('express').Request} req Express request object
     * @param {import('express').Response} res Express response object
     * @param {import('express').NextFunction} next Express next function
     * @returns {Promise<void>} Category
     */
	async delete(req, res, next) {
		try {
			const category = await Category.find(req.params.id)
			if (!category) {
				return res.status(404).json({
					message: 'Category not found'
				})
			}
			await category.delete()
			res.status(204).json()
		} catch (error) {
			return next(error)
		}
	}
}

export default new CategoryController()
