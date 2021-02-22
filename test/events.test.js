/* eslint-disable no-undef */
const fs = require('fs')
const chai = require('chai')
const { expect } = require('chai')
const chaiHttp = require('chai-http')
const faker = require('faker')
chai.use(chaiHttp)
const application = require('../api/app')
const app = chai.request.agent(application).keepOpen() // This will keep the request open and so the session

describe('#Events test with protected routes', () => {
  // Login a user to perform these requests. All requests in this describe block will share cookies
  before(async () => {
    await app
      .post('/auth/login')
      .send({
        email: 'john@example.com',
        password: '12345678'
      })
  })

  it('User creates and event', async () => {
    const res = await app.post('/events')
      .set('content-type', 'multipart/form-data')
      .attach('poster', fs.readFileSync('./static/icon.png'), 'icon.png')
      .field({
        type: 'Physical',
        title: 'Awesome event',
        description: faker.lorem.paragraph(10),
        from_date: new Date().toISOString().substr(0, 10),
        from_time: '09:30'
      })
    expect(res.status).equals(201)
  })

  it('Get current user\'s events', async () => {
    const res = await app.get('/events/currentUser')
    expect(res.status).equals(200)
    expect(res.body).to.be.an('Array')
  })

  it('Update an event', async () => {
    const res = await app
      .put('/events/2')
      .send({
        type: 'Online',
        title: 'New title',
        description: faker.lorem.paragraph(10),
        from_date: new Date().toISOString().substr(0, 10),
        from_time: '10:45'
      })
    expect(res.status).equals(201)
  })

  it('Updating an event you don\'t own should fail with 401', async () => {
    const res = await app
      .put('/events/1')
      .send({
        type: 'Online',
        title: 'New title',
        description: faker.lorem.paragraph(10),
        from_date: new Date().toISOString().substr(0, 10),
        from_time: '10:45'
      })
    expect(res.status).equals(401)
  })

  it('Get the updated Event', async () => {
    const res = await app.get('/events/2')
    expect(res.body.title).equals('New title')
  })

  it('User deletes and event', async () => {
    const res = await app.delete('/events/1')
    expect(res.body).equals('Deleted')
  })
})
