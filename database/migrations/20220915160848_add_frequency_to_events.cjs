/**
 * Run the migrations
 * @param {import('knex').Knex} knex
 * @returns Promise
 */
exports.up = function (knex) {
	return knex.schema.alterTable('events', table => {
		table.enum('frequency', ['daily', 'weekly', 'monthly', 'yearly'])
			.after('endDate')
			.comment('How often the event happens')
		table.integer('repeat_count')
			.after('frequency')
			.comment('How the number of repeats. NULL for no repeat, 0 for forever, an number for the times to repeat')
	})
}

/**
 * Reverse the migrations.
 * @param {import('knex').Knex} knex
 */
exports.down = function (knex) {
	return knex.schema.alterTable('events', table => {
		table.dropColumns(['frequency', 'repeat_count'])
	})
}
