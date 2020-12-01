/* eslint-disable no-unused-vars */
// const knexx = require('knex')()
exports.up = function (knex) {
	return knex.schema.createTable('users', (table) => {
		table.primary()
		table.string('name')
		table.string('email').unique()
		table.string('password')
		table.text('bio')
		table.timestamps()
	})
}

exports.down = function (knex) {
	return knex.schema.dropTableIfExists('users')
}
