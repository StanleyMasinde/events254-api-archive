/**
 * Run the migrations
 * @param {import('knex').Knex} knex
 * @returns Promise
 */
exports.up = function (knex) {
	return knex.schema.alterTable('tickets', (table) => {
		table.dateTime('availability')
			.defaultTo(knex.raw('NOW()'))
			.comment('When the ticket sales end')
		table.string('url').comment('The URL of the ticket')
	})
}

/**
 * Reverse the migrations.
 * @param {import('knex').Knex} knex
 */
exports.down = function (knex) {
	return knex.schema.alterTable('tickets', (table) => {
		return table.dropColumns(['availability', 'url'])
	})
}
