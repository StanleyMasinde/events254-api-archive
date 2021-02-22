
exports.up = function (knex) {
  return knex.schema.createTable('tickets', (table) => {
    table.bigIncrements('id')
    table.bigInteger('event_id').unsigned()
    table.bigInteger('price').defaultTo(0)
    table.bigInteger('limit').defaultTo(0)
    table.text('description')
  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('tickets')
}
