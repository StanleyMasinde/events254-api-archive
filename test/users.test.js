/* eslint-disable no-undef */
import chai, { use, expect } from 'chai'
import chaiHttp from 'chai-http'
use(chaiHttp)
import application from '../app.js'

const app = chai.request.agent(application).keepOpen()

describe('Users tests', () => {
	it('All users', (done) => {
		app.get('/users')
			.then((res) => {
				expect(res.status).equals(200)
				expect(res.body.data).to.be.an('array')
				done()
			})
			.catch((err) => {
				done(err)
			})
	})
})
