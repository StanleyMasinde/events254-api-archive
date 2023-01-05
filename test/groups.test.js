/* eslint-disable no-undef */
import { readFileSync } from 'fs'
import chai, {use, expect} from 'chai'
import chaiHttp from 'chai-http'
use(chaiHttp)
import faker from 'faker'
import slugify from '../app/actions/slugify.js'
import application from '../app.js'
import User from '../app/models/user.js'

const app = chai.request.agent(application).keepOpen()

const name = faker.company.companyName()
const slug = slugify(name)
const newName = faker.company.companyName()
const newSlug = slugify(newName)

let user = {
	name: faker.name.findName(),
	email: faker.internet.email(),
	password: 'strongpassword'
}

describe('Groups', () => {
	before(async () => {
		await User.register(user)
		const res = await app
			.post('/auth/login')
			.send({
				email: user.email,
				password: 'strongpassword'
			})
		expect(res).to.have.status(200)
	})

	it('Get all groups', async () => {
		const res = await app.get('/groups')
		expect(res.status).equals(200)
		expect(res.body.data).to.be.an('array')
	})

	it('#Create a new group', async () => {
		const res = await app.post('/groups')
			.set('content-type', 'multipart/form-data')
			.attach('picture', readFileSync('./public/icon.png'), 'icon.png')
			.field({
				name,
				description: faker.company.catchPhrase(),
				country: faker.address.county(),
				city: faker.address.city()
			})

		expect(res.status).equals(201)
		expect(res.body).to.haveOwnProperty('name', name)
		expect(res.body).to.haveOwnProperty('slug', slug)
	})

	// it('#Read information about a group', async () => {
	//   const res = await app.get(`/groups/${slug}`)
	//   expect(res.body).to.haveOwnProperty('name', name)
	//   expect(res.body).to.haveOwnProperty('slug', slug)
	// })

	it('#Update a given group', async () => {
		const res = await app.put(`/groups/${slug}`)
			.set('content-type', 'multipart/form-data')
			.attach('picture', readFileSync('./public/icon.png'), 'icon.png')
			.field({
				name: newName,
				description: faker.company.catchPhrase(),
				country: faker.address.county(),
				city: faker.address.city()
			})
		expect(res.status).equals(201)
	})

	it('Get the updated event', async () => {
		const res = await app.get(`/groups/${newSlug}`)
		expect(res.body).to.haveOwnProperty('name', newName)
		expect(res.body).to.haveOwnProperty('slug', newSlug)
	})

	// it('#Delete a given group', async () => {
	//   const res = await app.delete(`/groups/${newSlug}`)
	//   expect(res.status).equals(200)
	// })
})

describe('Group events', () => {
	it('Group creates and event', async () => {
		const res = await app.post(`/groups/${newSlug}/events`)
			.set('content-type', 'multipart/form-data')
			.attach('image', readFileSync('./public/icon.png'), 'icon.png')
			.field({
				location: faker.address.streetAddress(),
				about: 'Awesome event',
				description: faker.lorem.paragraph(10),
				startDate: new Date().toISOString().substr(0, 10),
				startTime: '09:30'
			})
		expect(res.status).equals(201)
	})

	it('Get current group\'s events', async () => {
		const res = await app.get(`/groups/${newSlug}/events/`)
		expect(res.status).equals(200)
		expect(res.body).to.be.an('Array')
	})

	// it('Update an event', async () => {
	//   const res = await app
	//     .put(`/groups/${newSlug}/events/3`)
	//     .send({
	//       location: faker.address.streetAddress(true),
	//       about: 'Events254 launch party (Group)',
	//       description: faker.lorem.paragraph(10),
	//       startDate: new Date().toISOString().substr(0, 10),
	//       startTime: '10:45'
	//     })
	//   expect(res.status).equals(201)
	// })

	// it('Updating an event you don\'t own should fail with 401', async () => {
	//   const res = await app
	//     .put(`/groups/${newSlug}/events/3`)
	//     .send({
	//       location: 'virtual',
	//       about: 'Events254 launch party',
	//       description: faker.lorem.paragraph(10),
	//       startDate: new Date().toISOString().substr(0, 10),
	//       startTime: '10:45'
	//     })
	//   expect(res.status).equals(401)
	// })

	// it('Get the updated Event', async () => {
	//   const res = await app.get('/events/3')
	//   expect(res.body.about).equals('Events254 launch party (Group)')
	// })

	// it('Group deletes an event', async () => {
	//   const res = await app.delete(`/groups/${newSlug}/events/3`)
	//   expect(res.body).equals('Deleted')
	// })
})
