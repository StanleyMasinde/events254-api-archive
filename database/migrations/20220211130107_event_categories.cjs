/**
 * Run the migrations.
 * @param {import('knex').Knex} knex
 */
exports.up = (knex) => {
	return knex.schema.createTable('categories', table => {
		table.increments('id').primary()
		table.string('name').notNullable()
		table.string('description')
		table.string('photo_url')
		table.timestamps(true, true)
	})
}


/**
 * Reverse the migrations.
 * @param {import('knex').Knex} knex
 */
exports.down = (knex) => {
	return knex.schema.dropTableIfExists('categories')
}