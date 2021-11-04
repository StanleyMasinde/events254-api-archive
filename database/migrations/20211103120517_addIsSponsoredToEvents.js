/**
 * Run the migrations
 * @param {import('knex').Knex} knex
 * @returns Promise
 */
export function up (knex) {
	return knex.schema.table('events', (table) => {
		table.boolean('is_sponsored').defaultTo(false)
	})
}

/**
 * Rollback the migrations
 * @param {import('knex').Knex} knex
 * @returns Promise
 */
export function down (knex) {
	return knex.schema.table('events', (table) => {
		table.dropColumn('is_sponsored')
	})
}