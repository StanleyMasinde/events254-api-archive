
exports.up = function (knex) {
  return knex.schema.createTable('events', (table) => {
    table.bigIncrements('id')
    table.string('title')
    table.string('description')
    table.date('date')
    table.time('time')
    table.string('duration')
    table.timestamps()
  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('events')
}
