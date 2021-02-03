const fs = require('fs')
const chai = require('chai')
const { expect } = require('chai')
const chaiHttp = require('chai-http')
const faker = require('faker')
chai.use(chaiHttp)

const request = require('supertest')

const application = require('../api/app')

let cookie
describe('#Events test with protected routes', () => {
  // using auth methods
  // eslint-disable-next-line no-undef
  before((done) => {
    request(application)
      .post('/auth/login')
      .send({
        email: 'john@example.com',
        password: '12345678'
      })
      .expect(200)
      .end(function (err, res) {
        if (err) { return done(err) }
        cookie = res.headers['set-cookie']
        return done()
      })
  })

  it('User creates and event', (done) => {
    request(application).post('/events')
      .set('cookie', cookie)
      .set('content-type', 'multipart/form-data')
      .attach('poster', fs.readFileSync('./static/icon.png'), 'icon.png')
      .field({
        type: 'Physical',
        title: 'Awesome event',
        description: faker.lorem.paragraph(10),
        from_date: new Date().toISOString().substr(0, 10),
        from_time: '09:30'
      })
      .expect(201)
      .end(function (err, res) {
        if (err) { return done(err) }
        return done()
      })
  })

  it('Get current user\'s events', (done) => {
    request(application).get('/events/currentUser')
      .set('cookie', cookie)
      .set('Accept', 'application/json')
      .expect(200)
      .end(function (err, res) {
        if (err) { return done(err) }
        return done()
      })
  })

  it('Update an event', (done) => {
    request(application).put('/events/1')
      .set('cookie', cookie)
      .send({
        type: 'Online',
        title: 'New title',
        description: faker.lorem.paragraph(10),
        from_date: new Date().toISOString().substr(0, 10),
        from_time: '10:45'
      })
      .expect(201)
      .end(function (err, res) {
        if (err) { return done(err) }
        return done()
      })
  })

  it('Get the updated Event', (done) => {
    request(application).get('/events/1')
      .set('cookie', cookie)
      .expect(200)
      .end(function (err, res) {
        expect(res.body.title).equals('New title')
        if (err) { return done(err) }
        return done()
      })
  })

  it('User deletes and event', (done) => {
    request(application).delete('/events/1')
      .set('cookie', cookie)
      .expect(200)
      .end(function (err, res) {
        if (err) { return done(err) }
        return done()
      })
  })
})
