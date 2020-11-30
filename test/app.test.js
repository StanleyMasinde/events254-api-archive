/* eslint-disable no-undef */
const chai = require('chai')
const { expect } = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const application = require('../app')

const app = chai.request.agent(application).keepOpen()

describe('Web test', () => {
	it('Index GET route should respond with 200', (done) => {
		app.get('/')
			.then(res => {
				expect(res.status).equals(200)
				done()
			})
			.catch(err => {
				done(err)
			})
	})
})

