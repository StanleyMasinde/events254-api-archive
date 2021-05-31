/**
 * Run the migrations
 * @param {import('knex')} knex
 * @returns Promise
 */
exports.up = function (knex) {
  return knex.schema.createTable('event_rsvps', (table) => {
    table.bigIncrements('id')
    table.bigInteger('event_id').unsigned()
    table.bigInteger('user_id').unsigned() // The person registering
    table.bigInteger('ticket_id').unsigned() // An RSVP takes a ticket
    table.bigInteger('rsvp_count').defaultTo(1) // This is the option for guests etc

    table.foreign('event_id').references('id').inTable('events')
    table.foreign('user_id').references('id').inTable('users')
    table.foreign('ticket_id').references('id').inTable('tickets')
  })
}

/**
 * Rollback the migrations
 * @param {import('knex')} knex
 * @returns Promise
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('event_rsvps')
}
