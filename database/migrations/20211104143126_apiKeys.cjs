/**
 * Run the migrations.
 * @param {import('knex').Knex} knex
 */
exports.up = (knex) => {
	return knex.schema.createTable('api_keys', table => {
		table.increments('id').primary()
		table.string('key').notNullable()
		table.string('app_name').notNullable()
		table.string('app_description')
		table.timestamps(true, true)
	})
}

/**
 * Reverse the migrations.
 * @param {import('knex').Knex} knex
 */
exports.down = (knex) => {
	return knex.schema.dropTable('api_keys')
}
