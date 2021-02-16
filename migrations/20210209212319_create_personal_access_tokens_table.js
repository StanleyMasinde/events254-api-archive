exports.up = function (knex) {
  return knex.schema.createTable('personal_access_tokens', (table) => {
    table.bigIncrements('id')
    table.string('tokenable_type')
    table.bigInteger('tokenable_id').unsigned()
    table.string('name')
    table.string('token')
    table.text('abilities')
    table.timestamp('last_used_at')
    table.timestamps(true, true)
  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('personal_access_tokens')
}
