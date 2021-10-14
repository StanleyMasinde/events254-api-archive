/* eslint-disable no-undef */
import { readFileSync } from 'fs'
import chai, {expect} from 'chai'
import chaiHttp from 'chai-http'
import faker from 'faker'
chai.use(chaiHttp)
import application from '../app.js'
const app = chai.request.agent(application).keepOpen() // This will keep the request open and so the session
import User from '../app/models/user.js'
import Event from '../app/models/event.js'
import Ticket from '../app/models/ticket.js'

let user = {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: 'strongpassword'
}

let event = {
  about: faker.lorem.sentence(),
  description: faker.lorem.paragraph(),
  startDate: faker.date.future(),
  endDate: faker.date.future(),
  location: faker.address.streetAddress(),
}


let eventId
let newEventId
let ticketId

describe('#Events test with protected routes', () => {
  // Login a user to perform these requests. All requests in this describe block will share cookies
  before(async () => {
    try {
      await User.register(user)
      let newEvent = await Event.create(event)
      let ticket = await Ticket.create({
        event_id: newEvent.id,
        price: faker.commerce.price(),
        currency: 'KES',
        limit: faker.datatype.number(),
        type: 'Regular'
      })
      newEventId = newEvent.id
      ticketId = ticket.id
      const res = await app
        .post('/auth/login')
        .send({
          email: user.email,
          password: 'strongpassword'
        })
      expect(res.body).to.have.property('email')
    } catch (err) {
      console.log(err)
    }
  })

  it('User creates an event', async () => {
    const res = await app.post('/events')
      .set('content-type', 'multipart/form-data')
      .attach('image', readFileSync('./public/icon.png'), 'icon.png')
      .field({
        location: faker.address.streetAddress(),
        about: 'Awesome event',
        description: faker.lorem.paragraph(10),
        startDate: new Date().toISOString().substr(0, 10),
        startTime: '09:30'
      })
    eventId = res.body.id
    expect(res.status).equals(201)
  })

  it('Get current user\'s events', async () => {
    const res = await app.get('/events/currentUser')
    expect(res.status).equals(200)
    expect(res.body).to.be.an('Array')
  })

  it('Update an event', async () => {
    const res = await app
      .put(`/events/${eventId}`)
      .send({
        location: faker.address.streetAddress(true),
        about: 'Events254 launch party',
        description: faker.lorem.paragraph(10),
        startDate: new Date().toISOString().substr(0, 10),
        startTime: '10:45'
      })
    expect(res.status).equals(201)
  })

  // it('Updating an event you don\'t own should fail with 401', async () => {
  //   const res = await app
  //     .put('/events/2')
  //     .send({
  //       location: 'virtual',
  //       about: 'Events254 launch party',
  //       description: faker.lorem.paragraph(10),
  //       startDate: new Date().toISOString().substr(0, 10),
  //       startTime: '10:45'
  //     })
  //   expect(res.status).equals(401)
  // })

  it('Get the updated Event', async () => {
    const res = await app.get(`/events/${eventId}`)
    expect(res.body.about).equals('Events254 launch party')
  })

  it('User deletes and event', async () => {
    const res = await app.delete(`/events/${eventId}`)
    expect(res.body.message).equals('Event deleted')
  })
})

describe('#Event registration', () => {
  before(async () => {
    // Authenticate a user
    await app
      .post('/auth/login')
      .send({
        email: user.email,
        password: 'strongpassword'
      })
    // create a ticket
    const res = await app.post(`/events/${newEventId}/tickets`)
      .send({
        price: faker.commerce.price(1000, 9999),
        limit: 1,
        type: faker.random.arrayElement(['VIP', 'Regular', 'General'])
      })
    ticketId = res.body.id
  })

  it('Register for event', async () => {
    const res = await app.post(`/events/${newEventId}/register`)
      .send({
        ticket_id: ticketId,
        rsvp_count: 1
      })
    expect(res.body).equals('You have registered for this event')
  })

  it('User cannot register for an event more than once', async () => {
    const res = await app.post(`/events/${newEventId}/register`)
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
    const res = await app.get('/events')
    expect(res.status).equals(200)
    expect(res.body).to.be.an('array')
  })

  // it('Get a specified event', async () => {
  //   try {
  //     const res = await app.get(`/events/${newEventId}`)
  //     console.log(res.body)
  //     expect(res.status).equals(200)
  //     expect(res.body).to.have.property('about')
  //   } catch (err) {
  //     console.log(err)
  //   }
  // })
})
