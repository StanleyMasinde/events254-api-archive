
exports.up = function (knex) {
  return knex.schema.createTable('event_rsvps', (table) => {
    table.bigIncrements('id')
    table.bigInteger('user_id').unsigned()
    table.bigInteger('event_id').unsigned()
    table.date('date')

    // TODO add DB level foreign consntraints later
  })
}

exports.down = function (knex) {
  knex.schema.dropTableIfExists('event_rsvps')
}
