/* eslint-disable no-unused-vars */
/**
 * Run the migrations
 * @param {import('knex')} knex
 * @returns Promise
 */
export function up (knex) {
	return knex.schema.createTable('users', (table) => {
		table.bigIncrements('id')
		table.string('name')
		table.string('username').unique()
		table.string('email').unique()
		table.string('password')
		table.text('bio')
		table.timestamps(true, true)
	})
}

/**
 * Rollback the migrations
 * @param {import('knex')} knex
 * @returns Promise
 */
export function down (knex) {
	return knex.schema.dropTableIfExists('users')
}
