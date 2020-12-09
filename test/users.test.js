/* eslint-disable no-undef */
const chai = require('chai')
const { expect } = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const application = require('../app')

const app = chai.request.agent(application).keepOpen()

describe('Users tests', () => {
  it('All users', (done) => {
    app.get('/api/users')
      .then((res) => {
        expect(res.status).equals(200)
        expect(res.body).to.be.an('array')
        done()
      })
      .catch((err) => {
        done(err)
      })
  })
})
