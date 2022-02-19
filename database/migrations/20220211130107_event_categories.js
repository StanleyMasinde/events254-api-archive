/**
 * Run the migrations.
 * @param {import('knex').Knex} knex
 */
export function up(knex) {
	return knex.schema.createTable('categories', table => {
		table.increments('id').primary()
		table.string('name').notNullable()
		table.string('description')
		table.timestamps(true, true)
	})
}


/**
 * Reverse the migrations.
 * @param {import('knex').Knex} knex
 */
export function down(knex) {
	return knex.schema.dropTableIfExists('categories')
}