/* eslint-disable no-undef */
import faker from 'faker'
import chai from 'chai'
import { expect } from 'chai'
import chaiHttp from 'chai-http'
chai.use(chaiHttp)
import application from '../app.js'
import Category from '../app/models/category.js'
const app = chai.request
	.agent(application)
	.keepOpen()

let user = {
	name: faker.name.findName(),
	email: faker.internet.email(),
	password: 'strongpassword'
}

let user2 = {
	name: faker.name.findName(),
	email: faker.internet.email(),
	password: 'strongpassword'
}

describe('Session Authentication tests', () => {
	it('Register a user', async () => {
		const res = await app
			.post('/auth/register')
			.send(user)
		expect(res.status).equals(200)
	})

	it('Login user with wrong PASSWORD should fail', async () => {
		const res = await app
			.post('/auth/login')
			.send({
				email: user.email,
				password: 'wrongpassword'
			})
		expect(res.status).equals(401)
	})

	it('Login user with wrong EMAIL should fail', async () => {
		const res = await app
			.post('/auth/login')
			.send({
				email: 'user@mail.com',
				password: user.password
			})
		expect(res.status).equals(401)
	})

	it('Login user with correct credentials', async () => {
		const res = await app
			.post('/auth/login')
			.send({
				email: user.email,
				password: user.password
			})
		expect(res.status).equals(200)
	})

	it('Get the current user', async () => {
		const res = await app.get('/auth/user')
		expect(res.status).equals(200)
		expect(res.body).haveOwnProperty('user')
	})

	it('Logout a user', async () => {
		const res = await app
			.post('/auth/logout')
		expect(res.status).equals(200)
	})

	it('Should return 401 when due to no authentication', async () => {
		const res = await app.get('/auth/user')
		expect(res.status).equals(401)
	})

	it('Send a password reset notification without email should fail', async () => {
		const res = await app.post('/auth/password')
		expect(res.status).equals(422)
		expect(res.body).to.haveOwnProperty('errors')
		expect(res.body.errors).to.be.an('Object')
	})

	it('Send a password reset notification', async () => {
		const res = await app
			.post('/auth/password')
			.set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.83 Safari/537.36')
			.send({
				email: user.email
			})
		expect(res.status).equals(200)
	})
})

describe('Authentication with personal API Tokens', () => {
	let token
	it('Should return a personal API token on registration', async () => {
		const res = await app
			.post('/auth/register')
			.set('X-requested-with', 'mobile')
			.send(user2)

		expect(res.status).equals(200)
		expect(res.body).to.haveOwnProperty('token')
	})

	it('Should return a personal API token on login', async () => {
		const res = await app
			.post('/auth/login')
			.set('X-requested-with', 'mobile')
			.send({
				email: user2.email,
				password: user2.password
			})
		expect(res.status).equals(200)
		expect(res.body.user).to.haveOwnProperty('token')
		token = res.body.user.token
	})

	it('Should get the current user using the API token', async () => {
		const res = await app
			.get('/auth/user')
			.set('X-requested-with', 'mobile')
			.set('Authorization', `Bearer ${token}`)
		expect(res.status).equals(200)
	})

	it('Should return 401 when no authorisation/token header', async () => {
		const res = await app
			.get('/auth/user')
			.set('X-requested-with', 'mobile')
		expect(res.status).equals(401)
	})

	it('Create an event using API token', async () => {
		try {
			const cat = await Category.create({
				name: faker.random.arrayElement(['Music', 'Sports', 'Arts', 'Food', 'Business', 'Health', 'Education', 'Fashion', 'Travel', 'Others']),
				description: faker.lorem.sentence(),
				photo_url: faker.image.imageUrl()
			})

			const res = await app
				.post('/events')
				.set('X-requested-with', 'mobile')
				.set('Authorization', `Bearer ${token}`)
				.send({
					location: faker.address.streetAddress(),
					location_name: 'Nairobi national park',
					formatted_address: 'Tom Mboya street, Nairobi',
					location_coordinates: '32.88, 1.778', 
					about: 'Awesome event',
					description: faker.lorem.paragraph(10),
					startDate: new Date().toISOString().substr(0, 10),
					startTime: '09:30',
					category_id: cat.id,
				})
			expect(res.status).equals(201)
			expect(res.body).to.haveOwnProperty('about')
		} catch (err) {
			throw new Error(err)
		}
	})
})
