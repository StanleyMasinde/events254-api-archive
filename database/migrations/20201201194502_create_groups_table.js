/**
 * Run the migrations
 * @param {import('knex')} knex
 * @returns Promise
 */
export function up (knex) {
	return knex.schema.createTable('groups', (table) => {
		table.bigIncrements('id')
		table.string('pictureUrl')
		table.string('name')
		table.string('slug').unique()
		table.text('description')
		table.string('country') // This will be useful in the landing page
		table.string('city') // Local are in case of group
		table.string('visibility').defaultTo('public') // A group can be public
		table.boolean('isCompany').defaultTo(0)
		table.string('timezone').defaultTo('Africa/Nairobi') // To autoconvert event times to it's local time
		table.timestamps(true, true)

		// A compnay can also have many categories
		// TODO create categories && A table for all images
	})
}

/**
 * Drop the migrations
 * @param {import('knex')} knex
 * @returns Promise
 */
export function down (knex) {
	return knex.schema.dropTableIfExists('groups')
}
