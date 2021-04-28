const faker = require('faker')
exports.seed = function (knex) {
  const events = []
  const tickets = []

  for (let row = 0; row < 50; row++) {
    // Create events
    events.push({
      image: faker.image.imageUrl(null, 500, null, true, true),
      location: faker.address.streetAddress(),
      online_link: faker.internet.url(),
      about: faker.lorem.words(),
      description: faker.lorem.paragraphs(5),
      startDate: faker.date.future(),
      endDate: faker.date.future(),
      organisable_id: 10,
      organisable_type: 'User'
    })
    // Create tickets
    tickets.push({
      event_id: row + 1,
      price: faker.commerce.price(100),
      limit: 0,
      type: 'General admission'
    })
  }
  // Deletes ALL existing entries
  return knex('events').insert(events).then(() => {
    return knex('tickets').insert(tickets)
  })
}
