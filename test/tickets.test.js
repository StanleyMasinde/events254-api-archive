/* eslint-disable no-undef */
const fs = require('fs')
const chai = require('chai')
const { expect } = require('chai')
const chaiHttp = require('chai-http')
const faker = require('faker')
chai.use(chaiHttp)
const application = require('../app')
const app = chai.request.agent(application).keepOpen()
const User = require('../app/models/user')

let user = {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: 'strongpassword'
}
let ticketId
let eventId

describe('#Events test with protected routes', () => {
  before(async () => {
    await User.register(user)
    await app
      .post('/auth/login')
      .send({
        email: user.email,
        password: 'strongpassword'
      })
    const res = await app.post('/events')
      .set('content-type', 'multipart/form-data')
      .attach('image', fs.readFileSync('./public/icon.png'), 'icon.png')
      .field({
        location: faker.address.streetAddress(),
        about: 'Awesome event',
        description: faker.lorem.paragraph(10),
        startDate: new Date().toISOString().substr(0, 10),
        startTime: '09:30'
      })
    eventId = res.body.id
  })

  it('Create a ticket', async () => {
    const res = await app.post(`/events/${eventId}/tickets`)
      .send({
        price: faker.commerce.price(1000, 9999),
        limit: 1,
        description: faker.random.arrayElement(['VIP', 'Regular', 'General'])
      })
    expect(res.status).equals(201)
    ticketId = res.body.id
    // expect(res.body).to.haveOwnProperty('event_id', 4)
  })

  it('Get all tickets', async () => {
    const res = await app.get('/events/4/tickets')
    expect(res.body).to.be.an('Array')
    expect(res.status).equals(200)
  })

  it('Get a specified ticket', async () => {
    const res = await app.get(`/events/${eventId}/tickets/${ticketId}`)
    expect(res.body).to.be.an('Object')
    expect(res.body).to.haveOwnProperty('event_id', eventId)
    expect(res.body).to.haveOwnProperty('id', ticketId)
  })

  it('Update a specified ticket', async () => {
    const res = await app.put(`/events/${eventId}/tickets/${ticketId}`)
      .send({
        price: 100,
        limit: 1,
        type: 'Updated description'
      })
    expect(res.body).to.be.an('Object')
    expect(res.body).to.haveOwnProperty('type', 'Updated description')
    expect(res.status).equals(200)
  })

  it('Delete a ticket', async () => {
    const res = await app.delete(`/events/${eventId}/tickets/${ticketId}`)
    expect(res.status).equals(200)
  })
})
