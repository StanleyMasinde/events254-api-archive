/**
 * Run the migrations.
 * @param {import('knex').Knex} knex
 */
exports.up = function(knex) {
	return knex.schema.alterTable('events', table => {
		table.integer('location_id').unsigned().after('category_id')
	})
}

/**
 * Reverse the migrations.
 * @param {import('knex').Knex} knex
 */
exports.down = function(knex) {
	return knex.schema.alterTable('events', table => {
		table.dropColumn('location_id')
	})
}
