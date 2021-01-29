/* eslint-disable no-undef */
const fs = require('fs')
const chai = require('chai')
const { expect } = require('chai')
const chaiHttp = require('chai-http')
const faker = require('faker')
chai.use(chaiHttp)
const application = require('../api/app')
const app = chai.request.agent(application).keepOpen()

describe('#Events test', () => {
  // The following tests require auth
  it('Login a user', (done) => {
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

  it('User creates and event', (done) => {
    app.post('/events')
      .set('content-type', 'multipart/form-data')
      .attach('poster', fs.readFileSync('./static/icon.png'), 'icon.png')
      .field({
        type: 'Physical',
        title: 'Awesome event',
        description: faker.lorem.paragraph(10),
        from_date: new Date().toISOString().substr(0, 10),
        from_time: '09:30'
      })
      .then((res) => {
        expect(res.status).equals(201)
        done()
      })
      .catch((err) => {
        done(err)
      })
  })

  it('Get current user\'s events', (done) => {
    app.get('/events/currentUser')
      .then((res) => {
        expect(res.status).equals(200)
        expect(res.body).to.be.an('Array')
        done()
      })
      .catch((err) => {
        done(err)
      })
  })

  it('Update an event', (done) => {
    app.put('/events/1')
      .send({
        type: 'Online',
        title: 'New title',
        description: faker.lorem.paragraph(10),
        from_date: new Date().toISOString().substr(0, 10),
        from_time: '10:45'
      })
      .then((res) => {
        expect(res.status).equals(201)
        done()
      })
      .catch((err) => {
        done(err)
      })
  })

  it('Get the updated Event', (done) => {
    app.get('/events/1')
      .then((ev) => {
        expect(ev.body.title).equals('New title')
        done()
      })
      .catch((e) => {
        done(e)
      })
  })

  it('User deletes and event', (done) => {
    app.delete('/events/1')
      .then((res) => {
        expect(res.status).equals(200)
        done()
      })
      .catch((err) => {
        done(err)
      })
  })
})
