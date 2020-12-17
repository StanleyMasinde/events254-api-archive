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
        name: 'John Doe',
        email: 'john@example.com',
        password: '12345678'
      })
      .then((res) => {
        expect(res.status).equals(200)
        done()
      })
      .catch((err) => {
        done(err)
      })
  })

  it('Login user with wrong PASSWORD should fail', (done) => {
    app
      .post('/auth/login')
      .send({
        email: 'john@example.com',
        password: '1234567'
      })
      .then((res) => {
        expect(res.status).equals(401)
        done()
      })
      .catch((err) => {
        done(err)
      })
  })

  it('Login user with wrong EMAIL should fail', (done) => {
    app
      .post('/auth/login')
      .send({
        email: 'john@mail.com',
        password: '12345678'
      })
      .then((res) => {
        expect(res.status).equals(401)
        done()
      })
      .catch((err) => {
        done(err)
      })
  })

  it('Login user with correct credentials', (done) => {
    app
      .post('/auth/login')
      .send({
        email: 'john@example.com',
        password: '12345678'
      })
      .then((res) => {
        expect(res.status).equals(200)
        done()
      })
      .catch((err) => {
        done(err)
      })
  })

  it('Logout a user', (done) => {
    app
      .post('/auth/logout')
      .then((res) => {
        expect(res.status).equals(200)
        done()
      })
      .catch((err) => {
        done(err)
      })
  })

  it('Send a password reset notification without email should fail', (done) => {
    app.post('/auth/password')
      .then((res) => {
        expect(res.status).equals(422)
        expect(res.body).to.haveOwnProperty('errors')
        expect(res.body.errors).to.be.an('Object')
        done()
      })
      .catch((e) => {
        done(e)
      })
  })

  it('Send a password reset notification', (done) => {
    app.post('/auth/password')
      .send({
        email: 'john@example.com'
      })
      .then((res) => {
        expect(res.status).equals(200)
        done()
      })
      .catch((e) => {
        done(e)
      })
  })
})
