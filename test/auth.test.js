/* eslint-disable no-undef */
const chai = require('chai')
const { expect } = require('chai')
const chaiHttp = require('chai-http')
const faker = require('faker')
chai.use(chaiHttp)
const application = require('../app')

const app = chai.request.agent(application).keepOpen()

describe('Authentication test', () => {
	it('register', (done) => {
		const name = faker.name.findName()
		const firstName = name.split(' ').shift()
		app.post('/auth/register')
			.send({
				name: name,
				email: faker.internet.email(firstName),
				username: faker.internet.userName(firstName),
				bio: faker.lorem.words(20),
				password: 'password'
			})
			.then((res) => {
				expect(res.status).equals(200)
				done()
			})
			.catch((err) => {
				done(err)
			})
	})
})

