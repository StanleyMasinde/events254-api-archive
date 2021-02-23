/* eslint-disable no-undef */
const fs = require('fs')
const chai = require('chai')
const { expect } = require('chai')
const chaiHttp = require('chai-http')
const faker = require('faker')
chai.use(chaiHttp)
const application = require('../api/app')
const app = chai.request.agent(application).keepOpen()

describe('#Events test with protected routes', () => {
  before(async () => {
    await app
      .post('/auth/login')
      .send({
        email: 'john@example.com',
        password: '12345678'
      })
    await app.post('/events')
      .set('content-type', 'multipart/form-data')
      .attach('poster', fs.readFileSync('./static/icon.png'), 'icon.png')
      .field({
        type: 'Physical',
        title: 'Third event',
        description: faker.lorem.paragraph(10),
        from_date: new Date().toISOString().substr(0, 10),
        from_time: '06:45'
      })
  })

  it('Create a ticket', async () => {
    const res = await app.post('/events/4/tickets')
      .send({
        price: 100,
        limit: 1,
        description: 'General admission'
      })
    expect(res.status).equals(201)
    expect(res.body).to.haveOwnProperty('event_id', 4)
  })

  it('Get all tickets', async () => {
    const res = await app.get('/events/4/tickets')
    expect(res.body).to.be.an('Array')
    expect(res.status).equals(200)
  })

  it('Get a specified ticket', async () => {
    const res = await app.get('/events/4/tickets/1')
    expect(res.body).to.be.an('Object')
    expect(res.body).to.haveOwnProperty('event_id', 2)
    expect(res.body).to.haveOwnProperty('id', 1)
  })

  it('Update a specified ticket', async () => {
    const res = await app.put('/events/4/tickets/1')
      .send({
        price: 100,
        limit: 1,
        description: 'Updated description'
      })
    expect(res.body).to.be.an('Object')
    expect(res.body).to.haveOwnProperty('description', 'Updated description')
    expect(res.status).equals(200)
  })

  it('Delete a ticket', async () => {
    const res = await app.delete('/events/4/tickets/1')
    expect(res.status).equals(200)
  })
})
