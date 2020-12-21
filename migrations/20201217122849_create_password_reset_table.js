
exports.up = function (knex) {
  return knex.schema.createTable('password_resets', (table) => {
    table.string('email').index()
    table.string('token')
    table.dateTime('created_at')
  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('password_resets')
}
