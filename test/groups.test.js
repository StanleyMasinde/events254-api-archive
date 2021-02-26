/* eslint-disable no-undef */
const chai = require('chai')
const { expect } = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const application = require('../backend/app')

const app = chai.request.agent(application).keepOpen()

describe('Groups', () => {
  before(async () => {
    await app
      .post('/auth/login')
      .send({
        email: 'john@example.com',
        password: '12345678'
      })
  })

  it('Get all groups', (done) => {
    app.get('/groups')
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
