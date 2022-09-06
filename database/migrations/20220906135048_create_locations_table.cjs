/**
 * Run the migrations.
 * @param {import('knex').Knex} knex
 */
exports.up = function (knex) {
	return knex.schema.createTable('locations', table => {
		table.increments('id').unsigned()
		table.string('name').notNullable()
		table.string('formatted_address')
		table.point('coordinates')
		table.timestamps(true, true)
	})
}

/**
 * Reverse the migrations.
 * @param {import('knex').Knex} knex
 */
exports.down = function (knex) {
	return knex.schema.dropTable('locations')
}
