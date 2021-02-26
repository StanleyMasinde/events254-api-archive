const faker = require('faker')
exports.seed = function (knex) {
  const rows = []

  for (let row = 0; row < 50; row++) {
    rows.push({
      image: faker.image.abstract(),
      location: faker.address.streetAddress(),
      online_link: faker.internet.url(),
      about: faker.lorem.words(),
      description: faker.unique(),
      startDate: faker.date.future(),
      endDate: faker.date.future(),
      organisable_id: 10,
      organisable_type: 'User'
    })
  }
  // Deletes ALL existing entries
  return knex('events').insert(rows)
}
