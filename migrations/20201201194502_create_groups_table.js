
exports.up = function (knex) {
  return knex.schema.createTable('groups', (table) => {
    table.bigIncrements('id')
    table.bigInteger('user_id').unsigned() // The creator of the group
    table.string('name')
    table.enum('type', ['community', 'company']).defaultTo('company') // A group can be a company or a community like opensource254
    table.string('slug')
    table.text('description')
    table.timestamps()

    table.foreign('user_id').references('id').inTable('users')
  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('groups')
}
