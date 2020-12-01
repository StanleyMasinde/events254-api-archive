/* eslint-disable camelcase */

const faker = require('faker')

exports.seed = function(knex) {
	// Deletes ALL existing entries
	return knex('groups').del()
		.then(function () {
			// Inserts seed entries
			return knex('groups').insert([
				{
					user_id: 1,
					name: faker.commerce.productName(),
					slug: faker.helpers.slugify(faker.commerce.productName()),
					description: faker.lorem.words(20)
				},
				{
					user_id: 1,
					name: faker.commerce.productName(),
					slug: faker.helpers.slugify(faker.commerce.productName()),
					description: faker.lorem.words(20)
				},
			])
		})
}
