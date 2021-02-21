
exports.up = function (knex) {
  return knex.schema.createTable('admins', (table) => {
    table.bigIncrements('id')
    table.string('name')
    table.string('email').unique()
    table.string('username').unique()
    table.string('password')
    table.timestamps(true, true)
  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('admins')
}
