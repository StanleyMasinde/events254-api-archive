/**
 * Run the migrations.
 * @param {import('knex').Knex} knex
 */
export function up (knex) {
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
export function down (knex) {
	return knex.schema.dropTable('api_keys')
}
