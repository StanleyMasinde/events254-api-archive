/* eslint-disable camelcase */

const faker = require('faker')
const slugify = require('../../app/actions/slugify')
const rows = []
const organisers = []
for (let index = 1; index < 51; index++) {
  organisers.push({
    group_id: index + 1,
    user_id: index + 1
  })
}
for (let index = 0; index < 50; index++) {
  const name = faker.company.companyName()
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
      return knex('groups').insert(rows).then(() => {
        return knex('group_organisers').insert(organisers)
      })
    })
}
