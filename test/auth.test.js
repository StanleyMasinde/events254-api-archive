/* eslint-disable no-undef */
const chai = require('chai')
const { expect } = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const application = require('../app')

const app = chai.request.agent(application).keepOpen()

describe('Authentication tests', () => {
  it('Register a user', (done) => {
    app.post('/auth/register')
      .send({
        password: 'secret'
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
