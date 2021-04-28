/* eslint-disable camelcase */

const faker = require('faker')
const slugify = require('../backend/app/actions/slugify')
const rows = []
for (let index = 0; index < 10; index++) {
  const name = faker.lorem.sentence()
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
  // Deletes ALL existing entries
  return knex('groups').del()
    .then(function () {
      // Inserts seed entries
      return knex('groups').insert(rows)
    })
}
