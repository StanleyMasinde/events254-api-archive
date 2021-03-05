/* eslint-disable no-undef */
const chai = require('chai')
const { expect } = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const faker = require('faker')
const slugify = require('../backend/app/actions/slugify')
const application = require('../backend/app')

const app = chai.request.agent(application).keepOpen()

describe('Groups', () => {
  const name = faker.company.companyName()
  const slug = slugify(name)
  const newName = faker.company.companyName()
  const newSlug = slugify(newName)

  before(async () => {
    await app
      .post('/auth/login')
      .send({
        email: 'john@example.com',
        password: '12345678'
      })
  })

  it('Get all groups', async () => {
    const res = await app.get('/groups')
    expect(res.status).equals(200)
    expect(res.body).to.be.an('array')
  })

  it('#Create a new group', async () => {
    const res = await app.post('/groups')
      .send({
        name,
        description: faker.company.catchPhrase(),
        country: faker.address.county(),
        city: faker.address.city()
      })
    expect(res.status).equals(201)
    expect(res.body).to.haveOwnProperty('name', name)
    expect(res.body).to.haveOwnProperty('slug', slug)
  })

  it('#Read information about a group', async () => {
    const res = await app.get(`/groups/${slug}`)
    expect(res.body).to.haveOwnProperty('name', name)
    expect(res.body).to.haveOwnProperty('slug', slug)
  })

  it('#Update a given group', async () => {
    const res = await app.put(`/groups/${slug}`)
      .send({
        name: newName,
        description: faker.company.catchPhrase(),
        country: faker.address.county(),
        city: faker.address.city()
      })
    expect(res.status).equals(201)
  })

  it('#Delete a given group', async () => {
    const res = await app.delete(`/groups/${newSlug}`)
    expect(res.status).equals(200)
  })
})
