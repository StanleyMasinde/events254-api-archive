/* eslint-disable no-undef */
const fs = require('fs')
const faker = require('faker')
const chai = require('chai')
const { expect } = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const application = require('../api/app')
const app = chai.request.agent(application).keepOpen()

describe('Session Authentication tests', () => {
  it('Register a user', async () => {
    const res = await app
      .post('/auth/register')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        password: '12345678'
      })
    expect(res.status).equals(200)
  })

  it('Login user with wrong PASSWORD should fail', async () => {
    const res = await app
      .post('/auth/login')
      .send({
        email: 'john@example.com',
        password: '1234567'
      })
    expect(res.status).equals(401)
  })

  it('Login user with wrong EMAIL should fail', async () => {
    const res = await app
      .post('/auth/login')
      .send({
        email: 'john@mail.com',
        password: '12345678'
      })
    expect(res.status).equals(401)
  })

  it('Login user with correct credentials', async () => {
    const res = await app
      .post('/auth/login')
      .send({
        email: 'john@example.com',
        password: '12345678'
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
    const res = await app.post('/auth/password')
      .send({
        email: 'john@example.com'
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
      .send({
        name: 'John Doe',
        email: 'john@mobile.com',
        password: '12345678'
      })
    expect(res.status).equals(200)
    expect(res.body).to.haveOwnProperty('token')
  })

  it('Should return a personal API token on login', async () => {
    const res = await app
      .post('/auth/login')
      .set('X-requested-with', 'mobile')
      .send({
        email: 'john@mobile.com',
        password: '12345678'
      })
    expect(res.status).equals(200)
    expect(res.body).to.haveOwnProperty('token')
    token = res.body.token
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
    const res = await app
      .post('/events')
      .set('content-type', 'multipart/form-data')
      .set('X-requested-with', 'mobile')
      .set('Authorization', `Bearer ${token}`)
      .attach('poster', fs.readFileSync('./static/icon.png'), 'icon.png')
      .field({
        type: 'Physical',
        title: 'Awesome event',
        description: faker.lorem.paragraph(10),
        from_date: new Date().toISOString().substr(0, 10),
        from_time: '10:30'
      })
    expect(res.status).equals(201)
  })
})
