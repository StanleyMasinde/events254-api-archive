const faker = require('faker')
exports.seed = function (knex) {
  const events = []
  const tickets = []
  const organisableIds = []
  for (let index = 1; index < 50; index++) {
    organisableIds.push(index)
  }

  for (let row = 0; row < 5000; row++) {
    const about = faker.lorem.sentence()
    const date = faker.date.future(0.04)
    // Create events
    events.push({
      image: faker.image.imageUrl(null, 500, null, true, true),
      location: faker.address.streetAddress(),
      online_link: faker.internet.url(),
      about: about.charAt(0).toLocaleUpperCase() + about.slice(1),
      description: faker.lorem.paragraphs(5),
      startDate: date,
      endDate: faker.date.future(0.001, date),
      organisable_id: faker.random.arrayElement(organisableIds),
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
