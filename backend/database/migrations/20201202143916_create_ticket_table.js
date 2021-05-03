
exports.up = function (knex) {
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

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('tickets')
}
