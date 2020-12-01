
exports.up = function (knex) {
	return knex.schema.createTable('admins', (table) => {
		table.primary()
		table.string('name')
		table.string('email').unique()
		table.string('username').unique()
		table.string('password')
		table.timestamps()
	})
}

exports.down = function (knex) {
	return knex.schema.dropTableIfExists('admins')
}
