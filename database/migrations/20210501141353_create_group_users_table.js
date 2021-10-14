/**
 * Run the migrations
 * @param {import('knex')} knex
 * @returns Promise
 */
export function up (knex) {
	return knex.schema.createTable('group_user', (table) => {
		table.bigIncrements('id')
		table.bigInteger('user_id').unsigned()
		table.bigInteger('group_id').unsigned()
		table.timestamps(true, true)

		table.foreign('user_id').references('id').inTable('users').onDelete('cascade')
		table.foreign('group_id').references('id').inTable('groups').onDelete('cascade')
	})
}

/**
 * Rollback the migrations
 * @param {import('knex')} knex
 * @returns Promise
 */
export function down (knex) {
	return knex.schema.dropTableIfExists('group_user')
}
