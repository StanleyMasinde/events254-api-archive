/* eslint-disable camelcase */

const faker = require('faker')
const rows = []
for (let index = 0; index < 10; index++) {
  rows.push({
    user_id: 1,
    name: faker.commerce.productName(),
    slug: faker.helpers.slugify(faker.commerce.productName()),
    description: faker.lorem.words(20)
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
