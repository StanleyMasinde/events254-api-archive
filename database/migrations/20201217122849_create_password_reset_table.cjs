/**
 * Run the migrations
 * @param {import('knex')} knex
 * @returns Promise
 */
exports.up = (knex) => {
	return knex.schema.createTable('password_resets', (table) => {
		table.string('email').index()
		table.string('token')
		table.timestamp('created_at')
	})
}

/**
 * rollback the migrations
 * @param {import('knex')} knex
 * @returns Promise
 */
exports.down = (knex) => {
	return knex.schema.dropTableIfExists('password_resets')
}
