/**
 *Run the migrations
 * @param {import('knex')} knex
 * @returns
 */
exports.up = function (knex) {
	return knex.schema.createTable('events', (table) => {
		table.bigIncrements('id')
		table.string('image')
		table.string('about')
		table.text('location')
		table.string('online_link')
		table.text('description')
		table.dateTime('startDate')
		table.dateTime('endDate')
		table.boolean('published').defaultTo(1)
		table.bigInteger('organisable_id')
		table.string('organisable_type')
		table.timestamps(true, true)

		// Create a fullText index
		table.index(['about', 'description'], 'fullTextIndex', 'FULLTEXT')

	})
}

/**
 *Run the migrations
 * @param {import('knex')} knex
 * @returns
 */
exports.down = function (knex) {
	return knex.schema.dropTableIfExists('events')
}
