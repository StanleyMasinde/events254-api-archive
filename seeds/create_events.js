const faker = require('faker')
exports.seed = function (knex) {
  const events = []
  const tickets = []

  for (let row = 0; row < 50; row++) {
    const about = faker.lorem.sentence()
    // Create events
    events.push({
      image: faker.image.imageUrl(null, 500, null, true, true),
      location: faker.address.streetAddress(),
      online_link: faker.internet.url(),
      about: about.charAt(0).toLocaleUpperCase() + about.slice(1),
      description: faker.lorem.paragraphs(5),
      startDate: faker.date.future(),
      endDate: faker.date.future(),
      organisable_id: faker.random.arrayElement([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
      organisable_type: faker.random.arrayElement(['User', 'Group'])
    })
    // Create tickets
    tickets.push({
      event_id: row + 1,
      price: faker.commerce.price(1000, 10000),
      limit: 0,
      type: faker.random.arrayElement(['VIP', 'Regular', 'General'])
    })
  }
  // Deletes ALL existing entries
  return knex('events').insert(events).then(() => {
    return knex('tickets').insert(tickets)
  })
}
