/* eslint-disable no-undef */
import chai, {expect} from 'chai'
import chaiHttp from 'chai-http'
import faker from 'faker'
chai.use(chaiHttp)
import application from '../app.js'
const app = chai.request.agent(application).keepOpen() // This will keep the request open and so the session
import User from '../app/models/user.js'
import Event from '../app/models/event.js'
import Ticket from '../app/models/ticket.js'
import Category from '../app/models/category.js'

let user = {
	name: faker.name.findName(),
	email: faker.internet.email(),
	password: 'strongpassword'
}

let event = {
	about: faker.lorem.sentence(),
	description: faker.lorem.sentence(),
	startDate: faker.date.future(),
	endDate: faker.date.future(),
	location: faker.address.streetAddress(),
}

let onlineEvent = {
	about: faker.lorem.sentence(),
	description: faker.lorem.sentence(),
	startDate: faker.date.future(),
	endDate: faker.date.future(),
	online_link: faker.internet.url(),
}

let category = {
	name: faker.random.arrayElement(['Music', 'Sports', 'Arts', 'Food', 'Business', 'Health', 'Education', 'Fashion', 'Travel', 'Others']),
	description: faker.lorem.sentence(),
	photo_url: faker.image.imageUrl()
}


let eventId
let onlineEventId
let newEventId
let ticketId
let onlineTicketId

describe('#Events test with protected routes', () => {
	// Login a user to perform these requests. All requests in this describe block will share cookies
	before(async () => {
		try {
			await User.register(user)
			const cat = await Category.create(category)
			event.category_id = cat.id
			onlineEvent.category_id = cat.id
			const newEvent = await Event.create(event)
			const newOnlineEvent = await Event.create(onlineEvent)
			const ticket = await Ticket.create({
				event_id: newEvent.id,
				price: faker.commerce.price(),
				currency: 'KES',
				limit: faker.datatype.number(),
				type: 'Regular'
			})
			const onlineTicket = await Ticket.create({
				event_id: newOnlineEvent.id,
				price: faker.commerce.price(),
				currency: 'KES',
				limit: faker.datatype.number(),
				type: 'Regular'
			})
			newEventId = newEvent.id
			ticketId = ticket.id
			onlineEventId = newOnlineEvent.id
			onlineTicketId = onlineTicket.id
			const res = await app
				.post('/auth/login')
				.send({
					email: user.email,
					password: 'strongpassword'
				})
			expect(res.body).to.have.property('email')
		} catch (err) {
			throw new Error(err)
		}
	})

	it('User creates an event', async () => {
		const res = await app.post('/events')
			.send({
				location: faker.address.streetAddress(),
				location_name: 'Nairobi national park',
				formatted_address: 'Tom Mboya street, Nairobi',
				location_coordinates: '32.88, 1.778', 
				about: 'Awesome event',
				description: faker.lorem.paragraph(10) + 'Some emoji? 😂😎',
				startDate: new Date().toISOString().substr(0, 10),
				startTime: '09:30',
				category_id: event.category_id
			})
		eventId = res.body.id
		expect(res.status).equals(201)
	})

	it('User creates an event with frequency', async () => {
		const res = await app.post('/events')
			.send({
				location: faker.address.streetAddress(),
				location_name: 'The club',
				formatted_address: 'Ring rd parklands',
				location_coordinates: '32.88, 1.778', 
				about: 'Awesome event',
				description: faker.lorem.paragraph(10) + 'Some emoji? 😂😎',
				startDate: new Date().toISOString().substr(0, 10), // TODO: Hey what do we use?
				startTime: '09:30',
				frequency: 'weekly',
				repeat_count: 0,
				category_id: event.category_id
			})
		expect(res.body.frequency).equals('weekly')
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
				startDate: new Date().toISOString().substring(0, 10),
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
		expect(res.body.message).equals('You have successfully registerd for this event')
	})

	it('Register for online event', async () => {
		const res = await app.post(`/events/${onlineEventId}/register`)
			.send({
				ticket_id: onlineTicketId,
				rsvp_count: 1
			})
		expect(res.body.message).equals('You have successfully registerd for this event')
	})

	it('User cannot register for an event more than once', async () => {
		const res = await app.post(`/events/${newEventId}/register`)
			.send({
				ticket_id: 1,
				rsvp_count: 1
			})
		expect(res.body.error).equals('You have already registered for this event')
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
		// expect(res.body.length).equals(20)
	})


	it('Should get a single event', async () => {
		const res = await app.get(`/events/${newEventId}`)
		expect(res.status).equals(200)
		expect(res.body).to.be.an('object')
	})

	it('Should get the news feed', async () => {
		const res = await app.get('/feed')

		// eslint-disable-next-line no-unused-vars
		Object.entries(res.body).forEach(([key, value]) => {
			expect(value).to.be.an('object')
		})
		expect(res.status).equals(200)
		expect(res.body).to.be.an('object')
	})
})
