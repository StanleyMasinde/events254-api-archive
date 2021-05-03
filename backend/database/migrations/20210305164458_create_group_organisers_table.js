
exports.up = function (knex) {
  return knex.schema.createTable('group_organisers', (table) => {
    table.bigIncrements('id')
    table.bigInteger('group_id').unsigned()
    table.bigInteger('user_id').unsigned()
    table.string('role').defaultTo('organiser')

    table.foreign('group_id').references('id').inTable('groups')
    table.foreign('user_id').references('id').inTable('users')
  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('group_organisers')
}
