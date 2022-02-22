/* eslint-disable no-undef */
import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
import faker from 'faker'
chai.use(chaiHttp)
import application from '../app.js'
import Category from '../app/models/category.js'
import User from '../app/models/user.js'
const app = chai.request.agent(application).keepOpen()


let user = {
	name: faker.name.findName(),
	email: faker.internet.email(),
	password: 'strongpassword'
}

let category = {
	name: faker.random.arrayElement(['Music', 'Sports', 'Arts', 'Food', 'Business', 'Health', 'Education', 'Fashion', 'Travel', 'Others']),
	description: faker.lorem.sentence(),
	photo_url: faker.image.imageUrl()
}

let categoryId

describe('#Event category test', () => {
	before(async () => {
		try {
			await User.register(user)
			const cat = await Category.create(category)
			categoryId = cat.id
		} catch (error) {
			throw new Error(error)
		}
	})


	it('Users should be able to create an event with a category', async () => {
		try {
			await app
				.post('/auth/login')
				.send({
					email: user.email,
					password: 'strongpassword'
				})
			const res = await app
				.post('/events')
				.send({
					about: faker.random.arrayElement(['Third annual music festival', 'Dance party', 'Blankets party', 'Fashion show', 'Business meeting', 'Health conference', 'Education conference', 'Fashion show', 'Travel conference', 'Others']),
					description: faker.lorem.sentence(),
					startDate: new Date().toISOString().substring(0, 10),
					startTime: '12:00',
					endDate: new Date().toISOString().substring(0, 10),
					endTime: '19:00',
					location: faker.address.streetAddress(true),
					category_id: categoryId
				})
			expect(res.status).to.equal(201)
			expect(res.body).to.have.property('about')
			expect(res.body).to.have.property('description')
			expect(res.body).to.have.property('category_id')
		} catch (error) {
			throw new Error(error)
		}
	})


	it('#Get all events in a category', async () => { })
})
