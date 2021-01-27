
exports.up = function (knex) {
  return knex.schema.createTable('tickets', (table) => {
    table.bigIncrements('id')
    table.bigInteger('price').defaultTo(0)
    table.bigInteger('limit')
    table.text('desription')
  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('tickets')
}
