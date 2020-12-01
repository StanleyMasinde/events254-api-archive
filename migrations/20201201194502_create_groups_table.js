
exports.up = function (knex) {
	return knex.schema.createTable('groups', (table) => {
		table.bigIncrements('id')
		table.bigInteger('user_id').unsigned()
		table.string('name')
		table.string('slug')
		table.text('description')
		table.timestamps()

		table.foreign('user_id').references('id').inTable('users')
	})
}

exports.down = function (knex) {
	return knex.schema.dropTableIfExists('groups')
}
