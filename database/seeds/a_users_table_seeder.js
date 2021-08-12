const faker = require('faker')

const rows = []
for (let index = 0; index < 500; index++) {
  const bio = faker.company.catchPhrase()
  rows.push({
    name: faker.name.findName(),
    email: faker.internet.exampleEmail(),
    password: faker.internet.password(8),
    bio
  })
}
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert(rows)
    })
}
