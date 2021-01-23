
exports.up = function (knex) {
  return knex.schema.createTable('events', (table) => {
    table.bigIncrements('id')
    table.string('poster_url')
    table.bigInteger('user_id').unsigned()
    table.string('type')
    table.string('meeting_link')
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
