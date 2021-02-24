const faker = require('faker')
exports.seed = function (knex) {
  const rows = []

  for (let row = 0; row < 50; row++) {
    rows.push({
      poster_url: faker.image.abstract(),
      type: 'offline',
      meeting_link: faker.internet.url(),
      title: faker.lorem.sentence(5),
      description: faker.lorem.paragraphs(3),
      from: faker.date.future(),
      to: faker.date.future(),
      organisable_id: 10,
      organisable_type: 'User'
    })
  }
  // Deletes ALL existing entries
  return knex('events').insert(rows)
}
