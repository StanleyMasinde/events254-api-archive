exports.up = function (knex) {
  return knex.schema.createTable('events', (table) => {
    table.bigIncrements('id')
    table.string('image')
    table.string('about')
    table.text('location') // Can be virtual
    table.string('online_link') // If the meeting is virtual
    table.text('description')
    table.dateTime('startDate') // It will contain both the date and time
    table.dateTime('endDate')
    table.bigInteger('organisable_id') // The database ID of the organiser
    table.string('organisable_type') // Can be user or group
    table.timestamps(true, true)
  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('events')
}
