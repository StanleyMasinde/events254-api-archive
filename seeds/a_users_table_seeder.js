const faker = require('faker')
exports.seed = function (knex) {
	// Deletes ALL existing entries
	return knex('users').del()
		.then(function () {
			// Inserts seed entries
			return knex('users').insert([
				{
					name: faker.name.findName(),
					username: faker.internet.userName(),
					email: faker.internet.email(),
					password: faker.internet.password(8),
					Bio: faker.lorem.words(10)
				},
				{
					name: faker.name.findName(),
					username: faker.internet.userName(),
					email: faker.internet.email(),
					password: faker.internet.password(8),
					Bio: faker.lorem.words(10)
				},
			])
		})
}
