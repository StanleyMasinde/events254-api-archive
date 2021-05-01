/* eslint-disable camelcase */

const faker = require('faker')
const slugify = require('../../app/actions/slugify')
const rows = []
const organisers = []
const members = []
const ids = []
for (let i = 1; i < 51; i++) {
  ids.push(i)
}
for (let index = 1; index < 5001; index++) {
  organisers.push({
    group_id: faker.random.arrayElement(ids),
    user_id: faker.random.arrayElement(ids)
  })
  members.push({
    user_id: faker.random.arrayElement(ids),
    group_id: faker.random.arrayElement(ids)
  })
}
for (let index = 0; index < 5000; index++) {
  const name = `${faker.company.companyName()},${faker.company.catchPhrase()}`
  rows.push({
    pictureUrl: faker.image.business(),
    name,
    slug: slugify(name),
    description: faker.lorem.paragraphs(3),
    country: faker.address.country(),
    city: faker.address.city(),
    visibility: 'public',
    timezone: 'Africa/Nairobi'
  })
}
exports.seed = function (knex) {
  // Del
  return knex('groups').insert(rows).then(() => {
    return knex('group_organisers').insert(organisers).then(() => {
      return knex('group_user').insert(members)
    })
  })
}
