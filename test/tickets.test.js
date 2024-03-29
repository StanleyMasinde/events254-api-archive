/* eslint-disable no-undef */
import { readFileSync } from 'fs'
import chai, { use, expect } from 'chai'
import chaiHttp from 'chai-http'
import faker from 'faker'
use(chaiHttp)
import application from '../app.js'
const app = chai.request.agent(application).keepOpen()
import User from '../app/models/user.js'
import Category from '../app/models/category.js'

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
let ticketId
let eventId

describe('#Events test with protected routes', () => {
	before(async () => {
		try {
			await User.register(user)
			const cat = await Category.create(category)
			const authUser = await app
				.post('/auth/login')
				.send({
					email: user.email,
					password: 'strongpassword'
				})
			const res = await app.post('/events')
				.set('content-type', 'multipart/form-data')
				.set('Authorization', `Bearer ${authUser.body.user.token}`)
				.attach('image', readFileSync('./public/icon.png'), 'icon.png')
				.field({
					location: faker.address.streetAddress(),
					location_name: 'Nairobi national park',
					formatted_address: 'Tom Mboya street, Nairobi',
					location_coordinates: '32.88, 1.778',
					about: 'Awesome event',
					description: faker.lorem.paragraph(10),
					startDate: new Date().toISOString().substr(0, 10),
					startTime: '09:30',
					category_id: cat.id
				})
			eventId = res.body.id
		} catch (err) {
			throw new Error(err)
		}
	})

	it('Create a ticket', async () => {
		const authUser = await app
			.post('/auth/login')
			.send({
				email: user.email,
				password: 'strongpassword'
			})
		const res = await app.post(`/events/${eventId}/tickets`)
			.set('Authorization', `Bearer ${authUser.body.user.token}`)
			.send({
				type: 'Early bird',
				price: faker.commerce.price(1000, 9999),
				limit: 1,
				description: faker.random.arrayElement(['VIP', 'Regular', 'General'])
			})
		expect(res.status).equals(201)
		ticketId = res.body.id
		// expect(res.body).to.haveOwnProperty('event_id', 4)
	})

	it('Get all tickets', async () => {
		const res = await app.get('/events/4/tickets')
		expect(res.body).to.be.an('Array')
		expect(res.status).equals(200)
	})

	it('Get a specified ticket', async () => {
		const res = await app.get(`/events/${eventId}/tickets/${ticketId}`)
		expect(res.body).to.be.an('Object')
		expect(res.body).to.haveOwnProperty('event_id', eventId)
		expect(res.body).to.haveOwnProperty('id', ticketId)
	})

	it('Update a specified ticket', async () => {
		const authUser = await app
			.post('/auth/login')
			.send({
				email: user.email,
				password: 'strongpassword'
			})
		const res = await app.put(`/events/${eventId}/tickets/${ticketId}`)
			.set('Authorization', `Bearer ${authUser.body.user.token}`)
			.send({
				price: 100,
				limit: 1,
				type: 'Updated description'
			})
		expect(res.body).to.be.an('Object')
		expect(res.body).to.haveOwnProperty('type', 'Updated description')
		expect(res.status).equals(200)
	})

	it('Delete a ticket', async () => {
		const authUser = await app
			.post('/auth/login')
			.send({
				email: user.email,
				password: 'strongpassword'
			})
		const res = await app
			.delete(`/events/${eventId}/tickets/${ticketId}`)
			.set('Authorization', `Bearer ${authUser.body.user.token}`)
		expect(res.status).equals(204)
	})
})
