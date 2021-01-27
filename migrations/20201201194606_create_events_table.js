
exports.up = function (knex) {
  return knex.schema.createTable('events', (table) => {
    table.bigIncrements('id')
    table.string('poster_url')
    table.string('type')
    table.string('meeting_link')
    table.string('title')
    table.string('description')
    table.dateTime('from') // It will contain both the date and time
    table.dateTime('to') // Can be null
    table.bigInteger('organisable_id')
    table.string('organisable_type') // Can be user or group
    table.timestamps()
  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('events')
}
