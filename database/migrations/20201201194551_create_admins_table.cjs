/**
 * Run the migrations
 * @param {import('knex')} knex
 * @returns Promise
 */
exports.up = (knex) => {
	return knex.schema.createTable('admins', (table) => {
		table.bigIncrements('id')
		table.string('name')
		table.string('email').unique()
		table.string('username').unique()
		table.string('password')
		table.timestamps(true, true)
	})
}

/**
 * rollback the migrations
 * @param {import('knex')} knex
 * @returns Promise
 */
exports.down = (knex) => {
	return knex.schema.dropTableIfExists('admins')
}
