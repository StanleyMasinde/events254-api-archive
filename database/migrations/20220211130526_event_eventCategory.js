/**
 * Run the migrations.
 * @param {import('knex').Knex} knex
 */
export function up(knex) {
	return knex.schema.createTable('category_event', table => {
		table.increments('id').primary()
		table.integer('event_id').notNullable()
		table.integer('category_id').notNullable()
	})
}


/**
 * Reverse the migrations.
 * @param {import('knex').Knex} knex
 */
export function down(knex) {
	return knex.schema.dropTableIfExists('category_event')
}