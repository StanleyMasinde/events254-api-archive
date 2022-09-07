/**
 * Run the migrations
 * @param {import('knex')} knex
 * @returns Promise
 */
exports.up = (knex) => {
	return knex.schema.createTable('tickets', (table) => {
		table.bigIncrements('id')
		table.bigInteger('event_id').unsigned()
		table.bigInteger('price').defaultTo(0)
		table.string('currency').defaultTo('KES')
		table.bigInteger('limit').defaultTo(0)
		table.string('type')

		table.foreign('event_id').references('id').inTable('events')
	})
}

/**
 * Drop the migrations
 * @param {import('knex')} knex
 * @returns Promise
 */
exports.down = (knex) => {
	return knex.schema.dropTableIfExists('tickets')
}
