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

  it('Create a new group', async () => {
    const name = faker.company.companyName()
    const res = await app.post('/groups')
      .send({
        name,
        description: faker.company.catchPhrase(),
        country: faker.address.county(),
        city: faker.address.city()
      })
    expect(res.status).equals(201)
    expect(res.body).to.haveOwnProperty('name', name)
    expect(res.body).to.haveOwnProperty('slug', slugify(name))
  })
})
