/* eslint-disable no-undef */
const fs = require('fs')
const chai = require('chai')
const { expect } = require('chai')
const chaiHttp = require('chai-http')
const faker = require('faker')
chai.use(chaiHttp)
const application = require('../backend/app')
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

  it('User creates an event', async () => {
    const res = await app.post('/events')
      .set('content-type', 'multipart/form-data')
      .attach('image', fs.readFileSync('./static/icon.png'), 'icon.png')
      .field({
        location: faker.address.streetAddress(),
        about: 'Awesome event',
        description: faker.lorem.paragraph(10),
        startDate: new Date().toISOString().substr(0, 10),
        startTime: '09:30'
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
        location: faker.address.streetAddress(true),
        about: 'Events254 launch party',
        description: faker.lorem.paragraph(10),
        startDate: new Date().toISOString().substr(0, 10),
        startTime: '10:45'
      })
    expect(res.status).equals(201)
  })

  it('Updating an event you don\'t own should fail with 401', async () => {
    const res = await app
      .put('/events/1')
      .send({
        location: 'virtual',
        about: 'Events254 launch party',
        description: faker.lorem.paragraph(10),
        startDate: new Date().toISOString().substr(0, 10),
        startTime: '10:45'
      })
    expect(res.status).equals(401)
  })

  it('Get the updated Event', async () => {
    const res = await app.get('/events/2')
    expect(res.body.about).equals('Events254 launch party')
  })

  it('User deletes and event', async () => {
    const res = await app.delete('/events/1')
    expect(res.body).equals('Deleted')
  })
})

describe('#Event registration', () => {
  before(async () => {
    // Authenticate a user
    await app
      .post('/auth/login')
      .send({
        email: 'john@example.com',
        password: '12345678'
      })
    // create a ticket
    await app.post('/events/2/tickets')
      .send({
        price: faker.commerce.price(1000, 9999),
        limit: 1,
        type: faker.random.arrayElement(['VIP', 'Regular', 'General'])
      })
  })

  it('Register for event', async () => {
    const res = await app.post('/events/2/register')
      .send({
        ticket_id: 1,
        rsvp_count: 1
      })
    expect(res.body).equals('You have registered for this event')
  })

  it('User cannot register for an event more than once', async () => {
    const res = await app.post('/events/2/register')
      .send({
        ticket_id: 1,
        rsvp_count: 1
      })
    expect(res.body).equals('You have already registerd for this event')
  })
})

describe('Event routes that do not require authentication', () => {
  // Logout the current user
  before(async () => {
    await app.post('/auth/logout')
  })

  it('Should get all events', async () => {
    const res = await app.get('/p/events')
    expect(res.status).equals(200)
    expect(res.body).to.be.an('array')
  })

  it('Get a specified event', async () => {
    const res = await app.get('/p/events/2')
    expect(res.status).equals(200)
    expect(res.body.about).equals('Events254 launch party')
  })
})
